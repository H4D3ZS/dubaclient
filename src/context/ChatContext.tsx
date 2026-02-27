'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { chatService, Message, ChatSession, Agent } from '@/lib/chat';

interface ChatState {
  isConnected: boolean;
  currentSession: ChatSession | null;
  messages: Message[];
  agents: Agent[];
  sessions: ChatSession[];
  isTyping: boolean;
  isChatOpen: boolean;
}

type ChatAction =
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_CURRENT_SESSION'; payload: ChatSession | null }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'SET_AGENTS'; payload: Agent[] }
  | { type: 'SET_SESSIONS'; payload: ChatSession[] }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_CHAT_OPEN'; payload: boolean }
  | { type: 'CLEAR_CHAT' };

const initialState: ChatState = {
  isConnected: false,
  currentSession: null,
  messages: [],
  agents: [],
  sessions: [],
  isTyping: false,
  isChatOpen: false,
};

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  connect: (userId: string, userType: 'customer' | 'agent' | 'admin' | 'staff') => void;
  disconnect: () => void;
  sendMessage: (content: string) => void;
  sendTypingIndicator: (isTyping: boolean) => void;
  createSession: (preferredSpecialty?: string) => void;
  refreshAgents: () => void;
  refreshSessions: (override?: { type: 'customer' | 'agent' | 'admin' | 'staff'; id?: string }) => void;
  openSession: (session: ChatSession) => void;
  closeSession: () => void;
  toggleChat: () => void;
} | undefined>(undefined);

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_AGENTS':
      return { ...state, agents: action.payload };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    case 'SET_CHAT_OPEN':
      return { ...state, isChatOpen: action.payload };
    case 'CLEAR_CHAT':
      return { ...state, messages: [], currentSession: null };
    default:
      return state;
  }
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [userInfo, setUserInfo] = React.useState<{ id: string; type: 'customer' | 'agent' | 'admin' | 'staff' } | null>(null);

  // Connect to chat service when component mounts
  useEffect(() => {
    // Listen for messages
    const unsubscribeMessage = chatService.onMessage((message) => {
      // Ensure timestamp is a Date object when receiving message
      const processedMessage = {
        ...message,
        timestamp: typeof message.timestamp === 'string' ? new Date(message.timestamp) : message.timestamp
      };
      dispatch({ type: 'ADD_MESSAGE', payload: processedMessage });
    });

    // Listen for typing indicators
    const unsubscribeTyping = chatService.onTyping(({ isTyping }) => {
      dispatch({ type: 'SET_TYPING', payload: isTyping });
    });

    // Listen for available agents
    const unsubscribeAgents = chatService.onAgentAvailable((agent) => {
      dispatch({ type: 'SET_AGENTS', payload: [agent] }); // Simplified for demo
    });

    // Cleanup on unmount
    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribeAgents();
      chatService.disconnect();
    };
  }, []);

  const connect = (userId: string, userType: 'customer' | 'agent' | 'admin' | 'staff') => {
    chatService.connect(userId, userType);
    setUserInfo({ id: userId, type: userType });
    dispatch({ type: 'SET_CONNECTED', payload: true });
    refreshAgents();
    if (userType !== 'customer') {
      refreshSessions({ type: userType, id: userId });
    }
  };

  const disconnect = () => {
    chatService.disconnect();
    dispatch({ type: 'SET_CONNECTED', payload: false });
    setUserInfo(null);
  };

  const refreshAgents = async () => {
    try {
      const agents = await chatService.getAgents();
      dispatch({ type: 'SET_AGENTS', payload: agents });
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const refreshSessions = async (override?: { type: 'customer' | 'agent' | 'admin' | 'staff'; id?: string }) => {
    try {
      const type = override?.type ?? userInfo?.type;
      const id = override?.id ?? userInfo?.id;
      const sessions = await chatService.getSessions(type, id);
      dispatch({ type: 'SET_SESSIONS', payload: sessions });
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const openSession = async (session: ChatSession) => {
    if (state.currentSession?.id && state.currentSession.id !== session.id) {
      await chatService.leaveSession(state.currentSession.id);
    }
    dispatch({ type: 'SET_CURRENT_SESSION', payload: session });
    chatService.focusSession(session.id);
    await chatService.joinSession(session.id);
    try {
      const messages = await chatService.getMessages(session.id);
      dispatch({ type: 'SET_MESSAGES', payload: messages });
    } catch (err) {
      console.error('Error fetching messages for session:', err);
    }
  };

  const sendMessage = async (content: string) => {
    if (state.currentSession) {
      try {
        const message = await chatService.sendMessage(state.currentSession.id, content);
        dispatch({
          type: 'ADD_MESSAGE',
          payload: message,
        });
      } catch (error) {
        console.error('Error sending message:', error);
        // Fallback to adding the message locally if API fails
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: `local-${Date.now()}`,
            senderId: 'current-user', // This would be replaced with actual user ID
            senderType: userInfo?.type || 'customer', // This would be dynamic
            content,
            timestamp: new Date(),
          },
        });
      }
    }
  };

  const sendTypingIndicator = (isTyping: boolean) => {
    if (state.currentSession) {
      chatService.sendTypingIndicator(state.currentSession.id, isTyping);
    }
  };

  const createSession = async (preferredSpecialty?: string) => {
    try {
      const customerId = userInfo?.id || `customer-${Date.now()}`;

      // Create a new session via the API with preferred specialty
      const newSession = await chatService.createSession(customerId, preferredSpecialty);

      dispatch({ type: 'SET_CURRENT_SESSION', payload: newSession });
      await chatService.joinSession(newSession.id);
      dispatch({ type: 'SET_SESSIONS', payload: [newSession, ...state.sessions] });

      // Get existing messages for this session and ensure timestamps are Date objects
      try {
        const messages = await chatService.getMessages(newSession.id);
        dispatch({ type: 'SET_MESSAGES', payload: messages });
      } catch (err) {
        console.error('Error fetching messages for new session:', err);
      }
    } catch (error) {
      console.error('Error creating chat session:', error);
      // Fallback to creating a local session if API fails
      const customerId = userInfo?.id || `customer-${Date.now()}`;
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        customerId: customerId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'SET_CURRENT_SESSION', payload: newSession });
      await chatService.joinSession(newSession.id);
    }
  };

  const closeSession = async () => {
    if (state.currentSession) {
      await chatService.leaveSession(state.currentSession.id);

      // Also make an API call to close the session on the server side
      try {
        await fetch(`/api/chat?sessionId=${state.currentSession.id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error closing session on server:', error);
      }

      dispatch({ type: 'SET_CURRENT_SESSION', payload: null });
      dispatch({ type: 'CLEAR_CHAT' });
    }
  };

  const toggleChat = () => {
    dispatch({ type: 'SET_CHAT_OPEN', payload: !state.isChatOpen });
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        dispatch,
        connect,
        disconnect,
        sendMessage,
        sendTypingIndicator,
        createSession,
        refreshAgents,
        refreshSessions,
        openSession,
        closeSession,
        toggleChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
