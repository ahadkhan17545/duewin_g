import React, { useState, useEffect, useRef } from "react";
import SupportHeader from "./SupportHeader";
import CommanHeader from "./CommanHeader";

const ChatFlow = () => {
  const [messages, setMessages] = useState([
    { text: "Hello, how are you doing?", sender: "user", timestamp: "08:15 AM" },
    { text: "I'm doing well, thank you! How can I help you today?", sender: "assistant", timestamp: "08:16 AM" },
    { text: "I have a question about the return policy for a product I purchased.", sender: "user", timestamp: "Just Now" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputMessage, sender: "user", timestamp: "Just Now" },
      ]);
      setInputMessage("");

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "...", sender: "assistant", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ]);
      }, 500);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-[#242424] min-h-screen flex flex-col">
      <CommanHeader title="Online" />
      <div className="flex-1 flex flex-col bg-black">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold">Online Chat</span>
            <div className="ml-auto bg-white/20 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-white/80">
            A live chat interface that allows for seamless, natural communication and connection.
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-2`}
            >
              {message.sender === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gray-700 mr-2 flex-shrink-0 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-sm">
                    <span>A</span>
                  </div>
                </div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-[#4a90e2] text-white"
                    : "bg-[#333332] text-white"
                }`}
              >
                {message.sender === "assistant" && <div className="font-medium mb-1">Assistant</div>}
                <p>{message.text}</p>
                <span className="text-xs opacity-70 block text-right mt-1">{message.timestamp}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 rounded-full text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Reply..."
              className="flex-1 p-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button type="button" className="p-2 rounded-full text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              type="submit"
              className="bg-[#4a90e2] p-2 rounded-full text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatFlow;