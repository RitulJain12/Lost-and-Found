import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';

const ChatSystem = ({ claimId, claimantName, claimantEmail, onClose, isClaimant = false }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [claimId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:2120/api/chat/messages/${claimId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(data || []);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch(
        `http://localhost:2120/api/chat/send/${claimId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify({ message: newMessage })
        }
      );
      const data = await response.json();
      if (response.ok) {
        setNewMessage('');
        await fetchMessages();
      } else {
        setError(data.msg || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const styles = `
    .chat-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1500;
      animation: fadeIn 0.3s ease;
    }

    .chat-container {
      background: rgba(15, 15, 19, 0.95);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(75, 203, 250, 0.2);
      border-radius: 20px;
      width: 100%;
      max-width: 500px;
      height: 600px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: rgba(75, 203, 250, 0.05);
      border-bottom: 1px solid rgba(75, 203, 250, 0.2);
      border-radius: 20px 20px 0 0;
    }

    .chat-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chat-header-icon {
      width: 40px;
      height: 40px;
      background: rgba(75, 203, 250, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4bcbfa;
    }

    .chat-header-text h3 {
      font-size: 1rem;
      color: #ffffff;
      margin-bottom: 2px;
    }

    .chat-header-text p {
      font-size: 0.75rem;
      color: #b0b0b0;
    }

    .chat-close-btn {
      background: none;
      border: none;
      color: #4bcbfa;
      cursor: pointer;
      font-size: 1.5rem;
      transition: all 0.3s ease;
    }

    .chat-close-btn:hover {
      color: #ffffff;
      transform: rotate(90deg);
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: rgba(75, 203, 250, 0.05);
      border-radius: 10px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(75, 203, 250, 0.3);
      border-radius: 10px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(75, 203, 250, 0.5);
    }

    .message-bubble {
      display: flex;
      animation: messageAppear 0.3s ease;
    }

    @keyframes messageAppear {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message-bubble.sent {
      justify-content: flex-end;
    }

    .message-bubble.received {
      justify-content: flex-start;
    }

    .message-text {
      max-width: 70%;
      padding: 12px 16px;
      border-radius: 12px;
      word-wrap: break-word;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .message-bubble.sent .message-text {
      background: linear-gradient(90deg, #4bcbfa 0%, #2575fc 100%);
      color: #ffffff;
      border-radius: 12px 4px 12px 12px;
    }

    .message-bubble.received .message-text {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      border: 1px solid rgba(75, 203, 250, 0.2);
      border-radius: 4px 12px 12px 12px;
    }

    .message-time {
      font-size: 0.7rem;
      color: #b0b0b0;
      margin-top: 4px;
      text-align: center;
      width: 100%;
    }

    .chat-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #b0b0b0;
      text-align: center;
    }

    .chat-empty svg {
      margin-bottom: 15px;
      opacity: 0.5;
    }

    .chat-error {
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid rgba(255, 107, 107, 0.3);
      color: #ff6b6b;
      padding: 12px;
      border-radius: 8px;
      font-size: 0.9rem;
      text-align: center;
    }

    .chat-input-form {
      display: flex;
      gap: 10px;
      padding: 15px 20px;
      background: rgba(75, 203, 250, 0.03);
      border-top: 1px solid rgba(75, 203, 250, 0.2);
      border-radius: 0 0 20px 20px;
    }

    .chat-input {
      flex: 1;
      padding: 12px 15px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(75, 203, 250, 0.3);
      border-radius: 10px;
      color: #ffffff;
      font-family: 'Poppins', sans-serif;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      outline: none;
    }

    .chat-input:focus {
      border-color: #4bcbfa;
      background: rgba(75, 203, 250, 0.05);
      box-shadow: 0 0 15px rgba(75, 203, 250, 0.2);
    }

    .chat-input::placeholder {
      color: #b0b0b0;
    }

    .chat-send-btn {
      padding: 12px 16px;
      background: linear-gradient(90deg, #4bcbfa 0%, #2575fc 100%);
      border: none;
      border-radius: 10px;
      color: #ffffff;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .chat-send-btn:hover:not(:disabled) {
      box-shadow: 0 0 20px rgba(75, 203, 250, 0.4);
      transform: translateY(-2px);
    }

    .chat-send-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(75, 203, 250, 0.2);
      border-top-color: #4bcbfa;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 600px) {
      .chat-container {
        max-width: 100%;
        height: 100vh;
        border-radius: 0;
        max-height: calc(100vh - 20px);
      }

      .message-text {
        max-width: 85%;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="chat-modal-overlay" onClick={onClose}>
        <div className="chat-container" onClick={(e) => e.stopPropagation()}>
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-icon">
                <MessageSquare size={20} />
              </div>
              <div className="chat-header-text">
                <h3>{claimantName}</h3>
                <p>{claimantEmail}</p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="chat-messages">
            {loading ? (
              <div className="chat-empty">
                <div className="loading-spinner"></div>
                <p>Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="chat-empty">
                <MessageSquare size={40} />
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx}>
                    <div className={`message-bubble ${msg.isCurrentUser ? 'sent' : 'received'}`}>
                      <div>
                        <div className="message-text">{msg.message}</div>
                        <div className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
            {error && <div className="chat-error">{error}</div>}
          </div>

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={sending || !newMessage.trim()}
            >
              {sending ? (
                <div className="loading-spinner"></div>
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatSystem;