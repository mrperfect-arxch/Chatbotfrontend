import React, { useState } from 'react';
import axios from 'axios';

function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { type: 'user', text: input }];

    if (input.startsWith('/image')) {
      const prompt = input.replace('/image', '').trim();

      try {
        const res = await axios.post('https://chatbot-bakend.onrender.com/generate-image', { prompt });
        setMessages([...updatedMessages, { type: 'image', url: res.data.image_url }]);
      } catch (error) {
        setMessages([...updatedMessages, { type: 'bot', text: 'Error generating image.' }]);
      }

    } else {
      try {
        const res = await axios.post('https://chatbot-bakend.onrender.com/chat', { message: input });
        setMessages([...updatedMessages, { type: 'bot', text: res.data.reply || 'No response.' }]);
      } catch (error) {
        setMessages([...updatedMessages, { type: 'bot', text: 'Error getting reply.' }]);
      }
    }

    setInput('');
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      backgroundColor: '#1f2937',
      borderRadius: '10px',
      padding: '20px'
    }}>
      <div style={{
        height: '400px',
        overflowY: 'scroll',
        marginBottom: '15px'
      }}>
        {messages.map((msg, index) => (
          msg.type === 'image' ? (
            <div key={index} style={{ textAlign: 'center', margin: '10px 0' }}>
              <img src={msg.url} alt="Generated" />
            </div>
          ) : (
            <div key={index} style={{
              marginBottom: '10px',
              textAlign: msg.type === 'user' ? 'right' : 'left'
            }}>
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
          )
        ))}
      </div>

      <div style={{ display: 'flex' }}>
        <input
          style={{
            flexGrow: 1,
            padding: '10px',
            borderRadius: '10px 0 0 10px',
            border: '1px solid #374151',
            backgroundColor: '#111827',
            color: 'white'
          }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type message or /image prompt"
        />
        <button
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '0 10px 10px 0',
            border: 'none'
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
