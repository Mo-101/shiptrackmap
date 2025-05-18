// DeepCALChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import Typewriter from 'typewriter-effect';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}


const DeepCALChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const knowledgeBase = {
    routes: ['route', 'transportation', 'shipping', 'lane', 'network'],
    inventory: ['stock', 'inventory', 'supply', 'warehouse'],
    costs: ['cost', 'budget', 'expenses', 'fee'],
    risks: ['risk', 'delay', 'issue', 'hold'],
  };

  const wittyComments = [
    "I'm crunching numbers like freight pallets.",
    'Let me optimize that for you.',
    'Logistics magic coming right up!',
    'Simulation complete. Here’s what I found...'
  ];

  const getCategory = (text: string) => {
    const lower = text.toLowerCase();
    for (const [key, keywords] of Object.entries(knowledgeBase)) {
      if (keywords.some(k => lower.includes(k))) return key;
    }
    return null;
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMessages: Message[] = [...messages, { sender: 'user' as 'user', text }];
    setMessages(newMessages);
    setInput('');

    const category = getCategory(text);
    const response = category
      ? {
          routes: 'Analyzing transportation routes...',
          inventory: 'Evaluating inventory levels...',
          costs: 'Calculating cost optimizations...',
          risks: 'Assessing potential risks...'
        }[category]
      : 'Try asking about routes, inventory, costs or risks!';

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: response }]);
    }, 1000);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <div className="flex h-[calc(100vh-64px)]">

      {/* Input Section */}
      <div className="w-1/3 p-6 border-r border-slate-700 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-400 mb-2">DeepCAL Oracle</h1>
          <p className="text-sm text-gray-400 mb-4">Mostar Symbolic Engine Prime 1</p>
        </div>
        <div className="mb-4">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about routes, inventory, or costs..."
            className="w-full h-32 p-3 rounded bg-slate-800 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={() => sendMessage(input)}
            className="mt-2 w-full bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>

      {/* Chat Display Section */}
      <div className="w-2/3 p-6 overflow-y-auto" ref={chatRef}>
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] p-3 rounded-lg shadow-md ${
                msg.sender === 'user'
                  ? 'bg-purple-600 ml-auto text-white'
                  : 'bg-slate-700 mr-auto text-white'
              }`}
            >
              {msg.sender === 'bot' ? (
                <Typewriter
                  options={{
                    strings: msg.text,
                    autoStart: true,
                    delay: 25,
                  }}
                />
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          ))}
        </div>
      </div>
        </div>
      </div>
  );
};

export default DeepCALChat;
