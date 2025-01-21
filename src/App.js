import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Styling for the chat interface

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  

  // Fetch messages from the backend
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a new message to the backend
  const sendMessage = async () => {
    
    if (input.trim() !== '') {
      try {
        // Send message to the backend
        await axios.post('http://localhost:5000/send-message', {
          sender: 'User',  // Hardcoded sender
          message: input,
        });

        // Update the messages state to include the new message
        setMessages([...messages, { sender: 'User', message: input }]);
        setInput('');

        // Optionally, simulate a bot response after sending the user's message
        setTimeout(() => {
          const botResponse = 'Bot response to: ' + input;
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'Bot', message: botResponse },
          ]);
        }, 1000);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>React Chat with MySQL</h2>
      </div>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'User' ? 'user' : 'bot'}`}
          >
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      
    </div>
  );
};

export default App;
