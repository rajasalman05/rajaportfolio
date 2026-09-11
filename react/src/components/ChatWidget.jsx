import React, { useState, useRef, useEffect } from "react";

const INITIAL_MESSAGES = [
  {
    sender: "bot",
    text: "Salam! Main Raja Salman Nadeem ka AI Assistant hoon. Main aapki kya madad kar sakta hoon?",
  },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const getBotResponse = (userText) => {
    const text = userText.toLowerCase().trim();

    // Acknowledgments / Short conversational phrases (Fixes "Acha" repeated fallback)
    if (["acha", "ok", "okay", "sahi hai", "sahi", "theek hai", "got it", "great", "zabardast"].includes(text)) {
      return "Ji bilkul! Agar koi aur sawal ho ya project discuss karna ho, toh zaroor batayein.";
    }

    // Identity & Intro
    if (text.includes("kon ho") || text.includes("kaun ho") || text.includes("who are you") || text.includes("intro")) {
      return "Main Raja Salman Nadeem ka AI Assistant hoon. Main aapko unke projects, full-stack skills aur services ke baare mein real-time guide kar sakta hoon.";
    }

    // Casual / How are you
    if (text.includes("kya haal") || text.includes("kaise ho") || text.includes("how are you") || text.includes("kya chal raha")) {
      return "Main bilkul theek-thaak! Aap batayein, aaj kis project ya service ke baare mein baat karni hai?";
    }

    // Services & Work Scope
    if (text.includes("service") || text.includes("kaam") || text.includes("offer") || text.includes("website") || text.includes("app") || text.includes("design")) {
      return "Raja Salman yeh major services provide karte hain:\n\n• Full-Stack Web Development (React, Django, PHP)\n• Mobile Applications (Flutter)\n• UI/UX & Graphic Design\n• E-Commerce Solutions";
    }

    // Contact & WhatsApp
    if (text.includes("contact") || text.includes("email") || text.includes("number") || text.includes("phone") || text.includes("rabta") || text.includes("whatsapp")) {
      return "Aap screen par majood Contact Form fill karke email bhej sakte hain, ya niche Floating WhatsApp button se direct live chat kar sakte hain.";
    }

    // Skills & Stack
    if (text.includes("skill") || text.includes("tech") || text.includes("stack") || text.includes("python") || text.includes("react") || text.includes("django") || text.includes("flutter")) {
      return "Core Technical Stack:\n\n• Frontend: React, Tailwind CSS, JavaScript\n• Backend: Python (Django), PHP, Neon PostgreSQL\n• Mobile: Flutter\n• Infrastructure: Git, VS Code, Render, Backblaze B2";
    }

    // Pricing
    if (text.includes("price") || text.includes("cost") || text.includes("rate") || text.includes("budget") || text.includes("paise") || text.includes("charge")) {
      return "Project ki cost uske scope aur time-frame par depend karti hai. Exact budget estimate ke liye Contact Form fill karein ya WhatsApp par connect karein.";
    }

    // Greetings
    if (text.includes("hi") || text.includes("hello") || text.includes("hey") || text.includes("aoa") || text.includes("slam") || text.includes("salam")) {
      return "Walaikum Assalam! Aapka khair-maqdam hai. Aaj main aapki kya madad karoon?";
    }

    // Smart Fallback
    return "Main aapka message samajh raha hoon. Specific details ke liye aap niche quick options choose kar sakte hain ya Contact Form / WhatsApp se direct baat kar sakte hain!";
  };

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    setIsTyping(true);

    // Natural typing delay like ChatGPT
    setTimeout(() => {
      const botReply = { sender: "bot", text: getBotResponse(query) };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[480px] bg-[#0c1017]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="font-mono text-sm font-semibold text-white block">RSN AI Assistant</span>
                <span className="text-[10px] text-emerald-400/80 font-mono">Online • Powered by RSN</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 whitespace-pre-line leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-500 text-black font-medium rounded-br-none"
                      : "bg-white/10 text-gray-200 border border-white/5 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* ChatGPT-style Typing Dots Animation */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-200 border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Choice Chips */}
          <div className="px-3 py-2 border-t border-white/5 bg-white/[0.02] flex gap-2 overflow-x-auto text-xs no-scrollbar">
            <button
              onClick={() => handleSend("Services kya hain?")}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap transition-all"
            >
              💼 Services
            </button>
            <button
              onClick={() => handleSend("Contact details batao")}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap transition-all"
            >
              📞 Contact
            </button>
            <button
              onClick={() => handleSend("Tech stack kya hai?")}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap transition-all"
            >
              ⚡ Tech Stack
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-white/10 flex gap-2 bg-white/5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              className="bg-emerald-500 text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-400 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-emerald-500 text-black shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
        aria-label="Toggle Chat"
      >
        💬
      </button>
    </div>
  );
}