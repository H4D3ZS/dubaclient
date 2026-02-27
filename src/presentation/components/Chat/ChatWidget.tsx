'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import styles from './ChatWidget.module.css';

const ChatWidget: React.FC = () => {
  const { state, connect, sendMessage, sendTypingIndicator, createSession, closeSession, toggleChat } = useChat();
  const [message, setMessage] = useState('');
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

  // Initialize chat session when widget is opened
  useEffect(() => {
    const storedId = window.localStorage.getItem('chatCustomerId');
    const customerId = storedId || `customer-${Date.now()}`;
    if (!storedId) {
      window.localStorage.setItem('chatCustomerId', customerId);
    }
    connect(customerId, 'customer');
  }, [connect]);

  useEffect(() => {
    if (state.isChatOpen && !state.currentSession) {
      createSession();
    }
  }, [state.isChatOpen, state.currentSession, createSession]);

  if (!state.isChatOpen) {
    return (
      <button 
        className={styles.chatTrigger} 
        onClick={toggleChat}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
        <span className={styles.badge}>Support</span>
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
          <span>Chat</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.chatWidget}>
      <div className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <h3>Quick Hire Support</h3>
          <span className={styles.statusIndicator}>
            <span className={styles.statusDot}></span>
            <span>Online</span>
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

      <div className={styles.chatMessages}>
        {state.messages.length === 0 ? (
          <div className={styles.welcomeMessage}>
            <h4>Hello! 👋</h4>
            <p>How can we help you today?</p>
            <p className={styles.agentsOnline}>
              {state.agents.length > 0 ? `${state.agents.length} agent(s) online` : 'Connecting...'}
            </p>
          </div>
        ) : (
          state.messages.map((msg) => (
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
          ))
        )}
        {state.isTyping && (
          <div className={styles.typingIndicator}>
            <span>Agent is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className={styles.chatInputForm}>
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type your message..."
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
    </div>
  );
};

export default ChatWidget;
