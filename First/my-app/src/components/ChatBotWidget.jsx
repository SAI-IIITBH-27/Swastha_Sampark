import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, User, Stethoscope, Heart, Clock, MapPin } from "lucide-react";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "Hello! I'm your medical assistant. How can I help you today?",
      type: "text"
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedQuestions = [
    {
      category: "Emergency Help",
      questions: [
        "What should I do in a medical emergency?",
        "How to perform CPR?",
        "Where is the nearest emergency room?",
        "What are heart attack symptoms?"
      ]
    },
    {
      category: "Appointments & Referrals",
      questions: [
        "How to book an appointment?",
        "What is the referral process?",
        "How to find a specialist?",
        "What documents do I need?"
      ]
    },
    {
      category: "Medical Information",
      questions: [
        "Common cold symptoms and treatment",
        "Diabetes management tips",
        "Blood pressure guidelines",
        "Vaccination schedules"
      ]
    },
    {
      category: "Hospital Services",
      questions: [
        "What specialties do you offer?",
        "Do you have emergency services?",
        "Insurance and payment options",
        "Visitor policies and hours"
      ]
    }
  ];

  const botResponses = {
    "What should I do in a medical emergency?": "In a medical emergency, call 112 immediately. Stay calm, provide your location clearly, and follow the operator's instructions. Do not move the patient if there's suspected spinal injury.",
    "How to perform CPR?": "For CPR: 1) Check responsiveness 2) Call for help 3) Perform 30 chest compressions 4) Give 2 rescue breaths 5) Continue until help arrives. Note: This is basic info - always get certified training.",
    "Where is the nearest emergency room?": "I can help you find the nearest emergency room. Please enable location access or tell me your area. You can also click 'Locate ER' in the emergency widget.",
    "What are heart attack symptoms?": "Heart attack symptoms include: chest pain/discomfort, shortness of breath, pain in arms/back/neck/jaw, nausea, cold sweat. If experiencing these, seek immediate medical help.",
    "How to book an appointment?": "You can book appointments through our website, mobile app, or by calling our helpline. Online booking is available 24/7 for most specialties.",
    "What is the referral process?": "Referrals can be made by your primary doctor through our digital portal. Emergency referrals are processed immediately. Normal referrals take 24-48 hours.",
    "How to find a specialist?": "Use our 'Find Doctors' section to search by specialty, location, or hospital. All our specialists are verified and certified.",
    "What documents do I need?": "Bring your ID, insurance card, previous medical records, and any current medications list. For first visit, arrive 15 minutes early for paperwork.",
    "Common cold symptoms and treatment": "Symptoms: runny nose, sore throat, cough, mild fever. Treatment: rest, fluids, over-the-counter meds. See a doctor if symptoms worsen or last over 10 days.",
    "Diabetes management tips": "Monitor blood sugar regularly, follow a balanced diet, exercise daily, take medications as prescribed, and attend regular check-ups with your doctor.",
    "Blood pressure guidelines": "Normal: below 120/80, Elevated: 120-129/<80, High: 130+/80+. Regular monitoring and lifestyle changes can help manage blood pressure.",
    "Vaccination schedules": "Vaccination schedules vary by age and health condition. Consult our immunization department for personalized schedule based on your medical history.",
    "What specialties do you offer?": "We offer Cardiology, Neurology, Ophthalmology, Pediatrics, Orthopedics, Emergency Medicine, and many more specialized services.",
    "Do you have emergency services?": "Yes, we provide 24/7 emergency services with trauma care, ICU, and emergency surgical facilities at all our partner hospitals.",
    "Insurance and payment options": "We accept most major insurance providers. Also offer cashless treatment, EMI options, and government health scheme benefits.",
    "Visitor policies and hours": "General visiting hours: 10 AM - 8 PM. ICU: limited hours. Check specific hospital policies as they may vary. Always maintain silence in patient areas."
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const handleQuickQuestion = (question) => {
    setMessages(prev => [...prev, { from: "user", text: question, type: "text" }]);
    
    setTimeout(() => {
      const response = botResponses[question] || "I understand your concern. For detailed medical advice, please consult with our healthcare professionals directly.";
      setMessages(prev => [...prev, { from: "bot", text: response, type: "text" }]);
    }, 1000);
  };

  const handleSend = () => {
    if (input.trim() === "") return;
    
    setMessages(prev => [...prev, { from: "user", text: input, type: "text" }]);
    setInput("");
    
    setTimeout(() => {
      const response = "Thank you for your message. For specific medical concerns, I recommend consulting with our healthcare team directly. Is there anything else I can help with?";
      setMessages(prev => [...prev, { from: "bot", text: response, type: "text" }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Medical Assistant</div>
              <div className="text-xs text-indigo-100">Online 24/7</div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-indigo-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 px-4 py-3 space-y-3 max-h-80 overflow-y-auto bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.from === "bot" && (
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-indigo-600" />
                  </div>
                )}
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[85%] ${
                    msg.from === "bot"
                      ? "bg-white text-slate-700 border border-slate-200"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.from === "user" && (
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3 h-3 text-indigo-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="space-y-3 mt-4">
                <div className="text-xs text-slate-500 font-medium">Quick questions you can ask:</div>
                {predefinedQuestions.map((category, catIndex) => (
                  <div key={catIndex} className="space-y-2">
                    <div className="text-xs text-slate-400 font-medium">{category.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {category.questions.map((question, questIndex) => (
                        <button
                          key={questIndex}
                          onClick={() => handleQuickQuestion(question)}
                          className="text-xs bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-3 bg-white">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSend}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-xs text-slate-400 text-center mt-2">
              For medical emergencies, call 112 immediately
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotWidget;