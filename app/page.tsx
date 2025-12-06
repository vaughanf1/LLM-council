'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: string; content: string }>>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setConversation((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setConversation((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setConversation((prev) => [
          ...prev,
          { role: 'error', content: `Error: ${data.error}` },
        ]);
      }
    } catch (error) {
      setConversation((prev) => [
        ...prev,
        { role: 'error', content: 'Failed to send message' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f9fafb, #e5e7eb)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#111827'
        }}>
          LLM Council
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          marginBottom: '32px'
        }}>
          Chat with AI powered by OpenRouter
        </p>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '20px',
          marginBottom: '20px',
          minHeight: '400px',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          {conversation.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '100px' }}>
              Start a conversation...
            </p>
          ) : (
            conversation.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '16px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: msg.role === 'user' ? '#0A84FF' : msg.role === 'error' ? '#fee2e2' : '#f3f4f6',
                  color: msg.role === 'user' ? 'white' : msg.role === 'error' ? '#dc2626' : '#111827',
                  marginLeft: msg.role === 'user' ? '60px' : '0',
                  marginRight: msg.role === 'user' ? '0' : '60px'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>
                  {msg.role === 'user' ? 'You' : msg.role === 'error' ? 'Error' : 'AI'}
                </div>
                <div style={{ fontSize: '16px', lineHeight: '1.5' }}>{msg.content}</div>
              </div>
            ))
          )}
          {loading && (
            <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>AI is thinking...</div>
          )}
        </div>

        <form onSubmit={sendMessage}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#0A84FF'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                background: loading || !message.trim() ? '#9ca3af' : '#0A84FF',
                color: 'white',
                cursor: loading || !message.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
