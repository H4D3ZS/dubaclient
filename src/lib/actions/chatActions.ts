'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Define interfaces for our chat system
export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderType: 'customer' | 'agent';
  content: string;
  timestamp: Date | string;
}

export interface ChatSession {
  id: string;
  customerId: string;
  agentId?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// In-memory storage for demo purposes
// In a real application, this would be stored in a database
let chatSessions: ChatSession[] = [];
let chatMessages: ChatMessage[] = [];

export async function createChatSession(customerId: string): Promise<ChatSession> {
  const newSession: ChatSession = {
    id: `session_${Date.now()}`,
    customerId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  chatSessions.push(newSession);
  
  // In a real application, you would save this to a database
  // await db.insert(chatSessionsTable).values(newSession);
  
  return newSession;
}

export async function sendMessage(
  sessionId: string,
  senderId: string,
  senderType: 'customer' | 'agent',
  content: string
): Promise<ChatMessage> {
  const newMessage: ChatMessage = {
    id: `msg_${Date.now()}`,
    sessionId,
    senderId,
    senderType,
    content,
    timestamp: new Date(),
  };

  chatMessages.push(newMessage);
  
  // Update session's last activity
  const sessionIndex = chatSessions.findIndex(s => s.id === sessionId);
  if (sessionIndex !== -1) {
    chatSessions[sessionIndex].updatedAt = new Date();
  }
  
  // In a real application, you would save this to a database
  // await db.insert(chatMessagesTable).values(newMessage);
  
  // Revalidate the chat page to show the new message
  revalidatePath(`/chat/${sessionId}`);
  
  return newMessage;
}

export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  const messages = chatMessages
    .filter(msg => msg.sessionId === sessionId)
    .map(msg => ({
      ...msg,
      timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
    }))
    .sort((a, b) => {
      const aTime = typeof a.timestamp === 'string' ? new Date(a.timestamp) : a.timestamp;
      const bTime = typeof b.timestamp === 'string' ? new Date(b.timestamp) : b.timestamp;
      return aTime.getTime() - bTime.getTime();
    });
  
  return messages;
}

export async function getActiveSessions(): Promise<ChatSession[]> {
  return chatSessions.filter(session => session.isActive);
}

export async function closeChatSession(sessionId: string): Promise<void> {
  const sessionIndex = chatSessions.findIndex(s => s.id === sessionId);
  if (sessionIndex !== -1) {
    chatSessions[sessionIndex].isActive = false;
    chatSessions[sessionIndex].updatedAt = new Date();
  }
  
  // In a real application, you would update the database
  // await db.update(chatSessionsTable)
  //   .set({ isActive: false, updatedAt: new Date() })
  //   .where(eq(chatSessionsTable.id, sessionId));
  
  revalidatePath('/admin/chat');
}