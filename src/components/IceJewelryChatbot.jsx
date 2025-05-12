import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './IceJewelryChatbot.css';

const IceJewelryChatbot = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Toggle between dark and light theme
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  // Initialize with welcome message
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbotMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([
        { 
          text: "Welcome to Ice Jewelz! ❄️💎 How can I help you today?", 
          sender: "bot",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
    
    const savedTheme = localStorage.getItem('chatbotDarkMode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
      document.body.classList.toggle('dark-mode', savedTheme === 'true');
    }
  }, []);

  // Q&A pairs with enhanced responses
  const qaPairs = {
    "hello": "Hello there! ❄️ Welcome to Ice Jewelz. How may I assist you today?",
    "hi": "Hi! 👋 What can I help you with today?",
    "material": "Our jewelry is crafted from:\n• Conflict-free diamonds\n• 24k gold plating\n• Hypoallergenic metals\n• Genuine ice crystals (seasonal)",
    "care": "To maintain your Ice Jewelz:\n1. Store in provided velvet pouch\n2. Avoid contact with perfumes\n3. Clean with microfiber cloth\n4. Remove before swimming",
    "price": "Our prices range from $50 for silver pieces to $5,000+ for diamond collections. Any specific piece you're interested in?",
    "default": "I'm not entirely sure about that, but I can help with:\n• Product details\n• Care instructions\n• Order status\n• Custom designs\nWhat would you like to know? ❄️"
  };

  // Custom cursor effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Speech synthesis
  const speakResponse = (response) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return;
    }

    recognition.current = new SpeechRecognition();
    recognition.current.lang = 'en-US';
    recognition.current.interimResults = false;

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, []);

  const handleStartListening = () => {
    if (recognition.current) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  // Message handling
  const generateResponse = (question) => {
    for (const [keyword, response] of Object.entries(qaPairs)) {
      if (question.includes(keyword)) return response;
    }
    return qaPairs.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { 
      text: input, 
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(input.toLowerCase());
      const botMessage = {
        text: response,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
      speakResponse(response);
      setIsTyping(false);
    }, 1000);
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Persist messages and theme
  useEffect(() => {
    localStorage.setItem('chatbotMessages', JSON.stringify(messages));
    localStorage.setItem('chatbotDarkMode', darkMode);
  }, [messages, darkMode]);

  // Quick questions
  const quickQuestions = [
    "What materials are used?",
    "How do I care for my jewelry?",
    "Do you offer customization?",
    "What's your return policy?"
  ];

  return (
    <div className={`chatbot-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Custom Cursor */}
      <motion.div
        className={`custom-cursor ${hovering ? 'hovering' : ''}`}
        animate={{
          x: cursorPos.x - 10,
          y: cursorPos.y - 10,
          scale: hovering ? 1.5 : 1
        }}
        transition={{ type: 'spring', damping: 20 }}
      />

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="chatbot-header"
      >
        <div className="header-content">
          <h1>Ice Jewelz ❄️</h1>
          <p>Your premium jewelry assistant</p>
        </div>
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="theme-toggle"
          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? '☀️' : '🌙'}
        </motion.button>
      </motion.div>

      {/* Chat Messages */}
      <div className="chatbot-messages" role="log" aria-live="polite">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={`${index}-${msg.timestamp}`}
              initial={{ opacity: 0, x: msg.sender === 'user' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`message ${msg.sender}`}
            >
              <div className="message-content">
                <div className="message-text" dangerouslySetInnerHTML={{ 
                  __html: msg.text.replace(/\n/g, '<br/>') 
                }} />
                <div className="message-time">{msg.timestamp}</div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="typing-indicator"
            >
              <div className="typing-dots">
                <span>❄️</span>
                <span>•</span>
                <span>•</span>
                <span>•</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div 
        className="chatbot-input"
        whileHover={{ scale: 1.01 }}
      >
        <motion.input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about our jewelry..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          whileFocus={{ borderColor: '#4ecdc4' }}
          aria-label="Type your message"
          disabled={isListening}
        />
        <div className="input-buttons">
          <motion.button
            onClick={handleSend}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            disabled={!input.trim()}
          >
            Send
          </motion.button>
          <motion.button
            onClick={handleStartListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={isListening ? 'listening' : ''}
            disabled={isListening}
          >
            {isListening ? '🎤 Listening...' : '🎤 Speak'}
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Questions */}
      <motion.div 
        className="quick-questions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>Try asking:</p>
        <div className="quick-buttons">
          {quickQuestions.map((q, i) => (
            <motion.button
              key={q}
              onClick={() => setInput(q)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            >
              {q}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default IceJewelryChatbot;