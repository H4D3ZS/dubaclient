'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { MessageCircle, ArrowLeft, Send, Users, Phone, Mail, X } from 'lucide-react';
import styles from './admin-chat.module.css';

export default function AdminChatPage() {
  const { state, connect, sendMessage, refreshSessions, openSession } = useChat();

  // Initialize chat connection for admin/staff user
  useEffect(() => {
    // In a real application, this would be the authenticated user's ID and role
    // For demo purposes, we'll use a default admin user
    const currentUserRole = 'admin'; // This would come from authentication in a real app
    connect('admin-staff-user-id', currentUserRole as any);
    refreshSessions({ type: 'admin', id: 'admin-staff-user-id' });

    // Poll for new sessions so customer chats appear in the admin portal automatically
    const fetchInterval = setInterval(() => {
      refreshSessions({ type: 'admin', id: 'admin-staff-user-id' });
    }, 5000);

    return () => clearInterval(fetchInterval);
  }, [connect, refreshSessions]);

  const [message, setMessage] = useState('');
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && state.currentSession) {
      sendMessage(message);
      setMessage('');
    }
  };

  useEffect(() => {
    if (!state.currentSession && state.sessions.length > 0) {
      const firstSession = state.sessions[0];
      setActiveSession(firstSession.id);
      openSession(firstSession);
    }
  }, [state.currentSession, state.sessions, openSession]);

  return (
    <div className={styles.adminChatPage}>
      {/* Admin-specific header */}
      <header className={styles.adminHeader}>
        <div className={styles.headerContent}>
          <button
            onClick={() => window.location.href = '/admin'}
            className={styles.backToAdminBtn}
          >
            <ArrowLeft size={20} />
            <span>Back to Admin Panel</span>
          </button>
          <h1>Customer Support Dashboard</h1>
          <div className={styles.headerActions}>
            <span className={styles.userRole}>Admin</span>
          </div>
        </div>
      </header>

      <div className={styles.adminChatContainer}>
        {/* Sidebar with active chats */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h4>Active Chats</h4>
            <span className={styles.chatsCount}>{state.sessions?.length || 0}</span>
          </div>

          <div className={styles.chatsList}>
            {state.sessions?.map(session => (
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
                    className={`${styles.message} ${msg.senderType === 'customer'
                        ? styles.customerMessage
                        : (msg.senderType === 'admin' || msg.senderType === 'staff')
                          ? styles.agentMessage
                          : styles.systemMessage
                      }`}
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
                  onChange={(e) => setMessage(e.target.value)}
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
}
