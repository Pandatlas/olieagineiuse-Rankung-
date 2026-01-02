
import React, { useState, useRef, useEffect } from 'react';
import { streamChat } from '../services/geminiService';
import { Language } from '../types';
import { translations } from '../translations';

interface ChatBotProps {
  language: Language;
}

const ChatBot: React.FC<ChatBotProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string, sources?: any[] }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (overrideText?: string) => {
    const messageToSend = overrideText || input;
    if (!messageToSend.trim()) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsTyping(true);

    let botMsg = '';
    let sources: any[] = [];
    try {
      const stream = streamChat(messageToSend, language);
      for await (const chunk of stream) {
        if (chunk.text) botMsg += chunk.text;
        if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            sources = chunk.candidates[0].groundingMetadata.groundingChunks;
        }
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.role === 'bot') {
            return [...prev.slice(0, -1), { role: 'bot', text: botMsg, sources }];
          }
          return [...prev, { role: 'bot', text: botMsg, sources }];
        });
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Service error." }]);
    }
    setIsTyping(false);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : language === 'it' ? 'it-IT' : 'ar-SA';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group border-2 border-slate-800 dark:border-slate-700"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-dots'} text-2xl group-hover:text-amber-500`}></i>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-50 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 transition-colors">
          <div className="p-4 bg-slate-900 text-white flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
              <i className="fa-solid fa-robot"></i>
            </div>
            <div>
              <h3 className="font-bold">Sommelier AI</h3>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">{t.expertEngine}</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
            {messages.length === 0 && (
              <div className="text-center py-10 text-slate-400 dark:text-slate-600">
                <i className="fa-solid fa-sparkles text-3xl mb-3 block"></i>
                <p className="text-sm">Speak to our expert.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-amber-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'}`}>
                  {m.text}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-bold text-slate-400 mb-1">SOURCES:</p>
                        {m.sources.map((s, si) => (
                            s.web && <a key={si} href={s.web.uri} target="_blank" className="block text-[10px] text-blue-500 dark:text-blue-400 underline truncate mb-1">{s.web.title || s.web.uri}</a>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-3 rounded-2xl flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex space-x-2">
            <div className="flex-1 relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={t.chatPlaceholder}
                className="w-full pl-4 pr-10 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
              />
              <button
                onClick={startVoiceInput}
                className={`absolute right-3 text-slate-400 hover:text-amber-600 transition-colors ${isListening ? 'text-amber-600 animate-pulse' : ''}`}
              >
                <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
              </button>
            </div>
            <button 
              onClick={() => handleSend()}
              className="w-10 h-10 bg-slate-900 dark:bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
            >
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;