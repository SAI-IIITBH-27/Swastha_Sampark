import React, { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    // Placeholder bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "bot", text: "Thanks for your message! We’ll get back to you soon." }]);
    }, 500);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-white rounded-xl shadow-xl border border-gray-300 flex flex-col overflow-hidden">
          <div className="bg-purple-600 text-white px-4 py-2 font-semibold">Chat with us</div>
          <div className="flex-1 px-4 py-3 space-y-2 max-h-64 overflow-y-auto text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg max-w-[75%] ${
                  msg.from === "bot"
                    ? "bg-gray-100 text-gray-800 self-start"
                    : "bg-purple-100 text-purple-800 self-end ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex border-t p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-l-md outline-none"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="bg-purple-600 text-white px-3 rounded-r-md hover:bg-purple-700"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotWidget;
