'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { MessageCircle, X, Send, Minus, Users, Phone, Mail } from 'lucide-react';
import styles from './StaffChatInterface.module.css';

const StaffChatInterface: React.FC = () => {
  const { state, connect, sendMessage, sendTypingIndicator, closeSession, toggleChat, refreshSessions, openSession } = useChat();
  const [message, setMessage] = useState('');
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
      sendTypingIndicator(false); // Stop typing indicator when message is sent
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    // Send typing indicator when user starts typing
    if (e.target.value.length > 0) {
      sendTypingIndicator(true);

      // Clear typing indicator after a delay if user stops typing
      setTimeout(() => {
        if (e.target.value === message) {
          sendTypingIndicator(false);
        }
      }, 1000);
    }
  };

  // Initialize staff connection when widget mounts
  useEffect(() => {
    const staffId = `staff-${Date.now()}`;
    connect(staffId, 'staff');
    refreshSessions({ type: 'staff', id: staffId });

    // Poll for new sessions so customer chats appear in the admin portal
    const fetchInterval = setInterval(() => {
      refreshSessions({ type: 'staff', id: staffId });
    }, 5000);

    return () => clearInterval(fetchInterval);
  }, [connect, refreshSessions]);

  useEffect(() => {
    if (!state.currentSession && state.sessions.length > 0) {
      const firstSession = state.sessions[0];
      setActiveSession(firstSession.id);
      openSession(firstSession);
    }
  }, [state.currentSession, state.sessions, openSession]);

  if (!state.isChatOpen) {
    return (
      <button
        className={styles.chatTrigger}
        onClick={toggleChat}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
        <span className={styles.badge}>Customer Support</span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className={styles.minimizedWidget}>
        <button
          className={styles.restoreButton}
          onClick={() => setIsMinimized(false)}
          aria-label="Restore chat"
        >
          <MessageCircle size={20} />
          <span>Support</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.staffChatWidget}>
      <div className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <h3>Customer Support Dashboard</h3>
          <span className={styles.statusIndicator}>
            <span className={styles.statusDot}></span>
            <span>Available</span>
          </span>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.minimizeButton}
            onClick={() => setIsMinimized(true)}
            aria-label="Minimize chat"
          >
            <Minus size={16} />
          </button>
          <button
            className={styles.closeButton}
            onClick={() => {
              closeSession();
              toggleChat();
            }}
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className={styles.staffChatContainer}>
        {/* Sidebar with active chats */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h4>Active Chats</h4>
            <span className={styles.chatsCount}>{state.agents.length}</span>
          </div>

          <div className={styles.chatsList}>
            {state.sessions.map(session => (
              <div
                key={session.id}
                className={`${styles.chatItem} ${activeSession === session.id ? styles.active : ''}`}
                onClick={() => {
                  setActiveSession(session.id);
                  openSession(session);
                }}
              >
                <div className={styles.chatAvatar}>
                  <Users size={20} />
                </div>
                <div className={styles.chatInfo}>
                  <h5>{session.customerId}</h5>
                  <p>Session #{session.id.substring(0, 6)}</p>
                </div>
                <div className={styles.chatStatus}>
                  <span className={styles.statusDot}></span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sidebarFooter}>
            <button className={styles.contactButton}>
              <Phone size={16} /> Call Customer
            </button>
            <button className={styles.contactButton}>
              <Mail size={16} /> Email Customer
            </button>
          </div>
        </div>

        {/* Main chat area */}
        <div className={styles.mainChatArea}>
          {state.messages.length === 0 ? (
            <div className={styles.noChatSelected}>
              <MessageCircle size={48} className={styles.noChatIcon} />
              <h4>Select a chat to start messaging</h4>
              <p>Choose a customer from the sidebar to begin a conversation</p>
            </div>
          ) : (
            <>
              <div className={styles.chatMessages}>
                {state.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.message} ${msg.senderType === 'customer' ? styles.customerMessage : styles.agentMessage}`}
                  >
                    <div className={styles.messageContent}>
                      <p>{msg.content}</p>
                      <span className={styles.timestamp}>
                        {(typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {state.isTyping && (
                  <div className={styles.typingIndicator}>
                    <span>Customer is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className={styles.chatInputForm}>
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  placeholder="Type your response..."
                  className={styles.chatInput}
                  disabled={!state.currentSession}
                />
                <button
                  type="submit"
                  className={styles.sendButton}
                  disabled={!message.trim() || !state.currentSession}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffChatInterface;
