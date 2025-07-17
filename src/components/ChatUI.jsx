import React, { useState } from 'react';
import axios from 'axios';

function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageToSend = input;
    setMessages(prev => [...prev, { type: 'user', text: messageToSend }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('https://chatbot1back.onrender.com/chat', { message: messageToSend });

      setMessages(prev => [...prev, { type: 'bot', text: res.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Error: Unable to get reply.' }]);
    }

    setIsTyping(false);
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', backgroundColor: '#1f2937', borderRadius: '10px', padding: '20px' }}>
      <div style={{ height: '400px', overflowY: 'scroll', marginBottom: '15px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px', textAlign: msg.type === 'user' ? 'right' : 'left' }}>
            <span style={{
              display: 'inline-block',
              padding: '10px 15px',
              borderRadius: '20px',
              backgroundColor: msg.type === 'user' ? '#2563eb' : '#10b981',
              color: 'white'
            }}>
              {msg.text}
            </span>
          </div>
        ))}

        {isTyping && (
          <div style={{ marginBottom: '10px', textAlign: 'left' }}>
            <span style={{
              display: 'inline-block',
              padding: '10px 15px',
              borderRadius: '20px',
              backgroundColor: '#10b981',
              color: 'white',
              fontStyle: 'italic'
            }}>
              Typing...
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex' }}>
        <input
          style={{ flexGrow: 1, padding: '10px', borderRadius: '10px 0 0 10px' }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '0 10px 10px 0'
          }}
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatUI;
