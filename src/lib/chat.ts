// Chat system implementation using HTTP polling for real-time communication
// In a real application, this would use WebSockets or Server-Sent Events

// Define chat interfaces
export interface Message {
  id: string;
  senderId: string;
  senderType: 'customer' | 'agent' | 'admin' | 'staff';
  content: string;
  timestamp: Date | string;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  customerId: string;
  agentId?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  isAvailable: boolean;
  currentChatSessionId?: string;
}

class ChatService {
  private static instance: ChatService;
  private eventSource: EventSource | null = null;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private typingCallbacks: ((data: { sessionId: string, userId: string, isTyping: boolean }) => void)[] = [];
  private agentCallbacks: ((agent: Agent) => void)[] = [];
  private sessionCallbacks: ((session: ChatSession) => void)[] = [];
  private userId: string | null = null;
  private userType: 'customer' | 'agent' | 'admin' | 'staff' | null = null;
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastCheckedTimestamps: Map<string, Date> = new Map(); // Track last checked time per session

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  connect(userId: string, userType: 'customer' | 'agent' | 'admin' | 'staff'): void {
    this.userId = userId;
    this.userType = userType;

    // Establish Server-Sent Events connection for real-time updates
    this.connectSSE();
  }

  disconnect(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  private connectSSE(): void {
    // In a real implementation, this would connect to an SSE endpoint
    // For now, we'll simulate real-time updates with polling
    console.log('Connecting to chat service...');

    // Start polling for new messages if not already running
    if (!this.pollingInterval) {
      this.startPolling();
    }
  }

  private startPolling(): void {
    // Poll for new messages every 2 seconds
    this.pollingInterval = setInterval(async () => {
      if (this.userId && this.userType) {
        await this.checkForNewMessages();
      }
    }, 2000);
  }

  private async checkForNewMessages(): Promise<void> {
    if (!this.userId) return;

    // Get the current session if available
    if (this.lastCheckedTimestamps.size > 0) {
      for (const [sessionId] of this.lastCheckedTimestamps) {
        try {
          // Get all messages for this session
          const messages = await this.getMessages(sessionId);

          // Get the last checked timestamp for this session
          const lastChecked = this.lastCheckedTimestamps.get(sessionId) || new Date(0);

          // Filter messages that were sent after the last check
          const newMessages = messages.filter(msg => {
            const msgTimestamp = typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp;
            return msgTimestamp > lastChecked;
          });

          // Update the last checked timestamp to the newest message time
          if (messages.length > 0) {
            const latestMsg = messages.reduce((latest, current) => {
              const currentTs = typeof current.timestamp === 'string' ? new Date(current.timestamp) : current.timestamp;
              const latestTs = typeof latest.timestamp === 'string' ? new Date(latest.timestamp) : latest.timestamp;
              return currentTs > latestTs ? current : latest;
            });

            this.lastCheckedTimestamps.set(sessionId,
              typeof latestMsg.timestamp === 'string' ? new Date(latestMsg.timestamp) : latestMsg.timestamp
            );
          }

          // Trigger callbacks for each new message
          newMessages.forEach(message => {
            this.triggerMessageCallbacks(message);
          });
        } catch (error) {
          console.error('Error checking for new messages:', error);
        }
      }
    }
  }

  async sendMessage(sessionId: string, content: string): Promise<Message> {
    const response = await fetch('/api/chat', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        senderId: this.userId,
        senderType: this.userType,
        content,
        customerId: this.userType === 'customer' ? this.userId : undefined
      })
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied: You are not authorized to send messages to this session');
      }
      throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
    }

    const messageData = await response.json();

    // Check if the response contains an error or disabled message
    if (messageData.error || (typeof messageData.message === 'string' && messageData.message.includes('disabled'))) {
      throw new Error(messageData.error || messageData.message || 'Feature is disabled');
    }

    // Convert timestamp string to Date object
    const message: Message = {
      ...messageData,
      timestamp: typeof messageData.timestamp === 'string' ? new Date(messageData.timestamp) : messageData.timestamp
    };

    // Update the last checked timestamp for this session to prevent receiving our own message back immediately
    this.lastCheckedTimestamps.set(sessionId, new Date(message.timestamp));

    return message;
  }

  async sendTypingIndicator(sessionId: string, isTyping: boolean): Promise<void> {
    // In a real implementation, this would notify the server about typing status
    // For now, we'll just simulate it
    console.log(`Typing indicator: ${isTyping} in session ${sessionId}`);
  }

  async joinSession(sessionId: string): Promise<void> {
    // In a real implementation, this would register the user to receive messages for this session
    // For now, we'll just simulate it and start tracking this session for polling
    console.log(`Joined session: ${sessionId}`);

    // Initialize the last checked timestamp for this session to current time
    this.lastCheckedTimestamps.set(sessionId, new Date());
  }

  focusSession(sessionId: string): void {
    this.lastCheckedTimestamps.clear();
    this.lastCheckedTimestamps.set(sessionId, new Date());
  }

  async leaveSession(sessionId: string): Promise<void> {
    // In a real implementation, this would unregister the user from the session
    // For now, we'll just simulate it and stop tracking this session for polling
    console.log(`Left session: ${sessionId}`);

    // Remove this session from polling
    this.lastCheckedTimestamps.delete(sessionId);
  }

  async createSession(customerId: string, preferredSpecialty?: string): Promise<ChatSession> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        preferredSpecialty: preferredSpecialty || null
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    const sessionData = await response.json();

    // Convert timestamp strings to Date objects
    const session: ChatSession = {
      ...sessionData,
      createdAt: typeof sessionData.createdAt === 'string' ? new Date(sessionData.createdAt) : sessionData.createdAt,
      updatedAt: typeof sessionData.updatedAt === 'string' ? new Date(sessionData.updatedAt) : sessionData.updatedAt
    };

    return session;
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    // Build the URL with user type and customer ID for access control
    let url = `/api/chat?sessionId=${sessionId}&userType=${this.userType || ''}`;
    if (this.userType === 'customer' && this.userId) {
      url += `&customerId=${this.userId}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied: You are not authorized to view this session');
      }
      throw new Error('Failed to fetch messages');
    }

    const messagesData = await response.json();

    // Convert timestamp strings to Date objects
    const messages: Message[] = messagesData.map((msg: any) => ({
      ...msg,
      timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
    }));

    return messages;
  }

  async getAgents(): Promise<Agent[]> {
    const response = await fetch('/api/chat?agents=1');
    if (!response.ok) {
      throw new Error('Failed to fetch agents');
    }
    return response.json();
  }

  async getSessions(userType?: 'customer' | 'agent' | 'admin' | 'staff' | null, agentId?: string | null): Promise<ChatSession[]> {
    const params = new URLSearchParams();
    if (userType) {
      params.set('userType', userType);
    }
    if (agentId && userType === 'agent') {
      params.set('agentId', agentId);
    }
    const url = `/api/chat?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('getSessions error:', response.status, errorText);
      throw new Error('Failed to fetch sessions');
    }
    const sessionsData = await response.json();
    return sessionsData.map((session: any) => ({
      ...session,
      createdAt: typeof session.createdAt === 'string' ? new Date(session.createdAt) : session.createdAt,
      updatedAt: typeof session.updatedAt === 'string' ? new Date(session.updatedAt) : session.updatedAt
    }));
  }

  onMessage(callback: (message: Message) => void): () => void {
    this.messageCallbacks.push(callback);

    // Return a function to remove the callback
    return () => {
      const index = this.messageCallbacks.indexOf(callback);
      if (index !== -1) {
        this.messageCallbacks.splice(index, 1);
      }
    };
  }

  onTyping(callback: (data: { sessionId: string, userId: string, isTyping: boolean }) => void): () => void {
    this.typingCallbacks.push(callback);

    // Return a function to remove the callback
    return () => {
      const index = this.typingCallbacks.indexOf(callback);
      if (index !== -1) {
        this.typingCallbacks.splice(index, 1);
      }
    };
  }

  onAgentAvailable(callback: (agent: Agent) => void): () => void {
    this.agentCallbacks.push(callback);

    // Return a function to remove the callback
    return () => {
      const index = this.agentCallbacks.indexOf(callback);
      if (index !== -1) {
        this.agentCallbacks.splice(index, 1);
      }
    };
  }

  onCreateSession(callback: (session: ChatSession) => void): () => void {
    this.sessionCallbacks.push(callback);

    // Return a function to remove the callback
    return () => {
      const index = this.sessionCallbacks.indexOf(callback);
      if (index !== -1) {
        this.sessionCallbacks.splice(index, 1);
      }
    };
  }

  // Method to trigger callbacks (used internally or by polling mechanism)
  triggerMessageCallbacks(message: Message): void {
    this.messageCallbacks.forEach(callback => callback(message));
  }

  triggerTypingCallbacks(data: { sessionId: string, userId: string, isTyping: boolean }): void {
    this.typingCallbacks.forEach(callback => callback(data));
  }

  triggerAgentCallbacks(agent: Agent): void {
    this.agentCallbacks.forEach(callback => callback(agent));
  }

  triggerSessionCallbacks(session: ChatSession): void {
    this.sessionCallbacks.forEach(callback => callback(session));
  }
}

export const chatService = ChatService.getInstance();
