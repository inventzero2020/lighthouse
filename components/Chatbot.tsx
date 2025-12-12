import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Wind, Eye, Mic, Square, Loader2, MicOff } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello. I'm your 3AM Friend. \n\nThe night can be long, but you don't have to get through it alone. I'm here to listen without judgment, help you ground yourself, or just sit with you in the dark. \n\nHow are you holding up?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const response = await sendMessageToGemini(messages, text);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = async () => {
    setMicError(false);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Media devices not supported");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64String = (reader.result as string).split(',')[1];
          await sendAudioMessage(base64String);
        };
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setMicError(true);
      // Reset error state after 3 seconds
      setTimeout(() => setMicError(false), 3000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioMessage = async (audioBase64: string) => {
    const tempId = Date.now().toString();
    const userMsg: Message = {
      id: tempId,
      text: "🎤 Sending voice message...",
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const response = await sendMessageToGemini(messages, "", audioBase64);

    // Update user message with transcript if available
    setMessages((prev) => prev.map(msg => 
        msg.id === tempId 
        ? { ...msg, text: response.transcript ? `🎤 "${response.transcript}"` : "🎤 Voice Message" } 
        : msg
    ));

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <div className="bg-teal-800 p-4 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
            <div className="bg-teal-700 p-2 rounded-full">
                <Sparkles size={20} className="text-yellow-300" />
            </div>
            <div>
            <h3 className="font-bold text-lg leading-tight">3AM Friend</h3>
            <p className="text-xs text-teal-200">Always here to listen.</p>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                <span>{msg.sender === 'user' ? 'You' : '3AM Friend'}</span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        {messages.length < 3 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                <button 
                    onClick={() => handleSend("I'm feeling anxious")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-medium hover:bg-teal-100 transition-colors whitespace-nowrap"
                >
                    <Wind size={12} /> I'm anxious
                </button>
                <button 
                    onClick={() => handleSend("Help me ground myself")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-medium hover:bg-teal-100 transition-colors whitespace-nowrap"
                >
                    <Eye size={12} /> Grounding help
                </button>
                <button 
                    onClick={() => handleSend("I just need to vent")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-medium hover:bg-teal-100 transition-colors whitespace-nowrap"
                >
                    <Sparkles size={12} /> Vent
                </button>
            </div>
        )}

        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            disabled={isLoading || isRecording}
          />
          
          {isRecording ? (
            <button
                onClick={stopRecording}
                className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-colors shadow-sm animate-pulse"
            >
                <Square size={20} className="fill-current" />
            </button>
          ) : (
            <button
                onClick={startRecording}
                disabled={isLoading}
                className={`p-3 rounded-xl transition-colors ${micError ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50'}`}
                title={micError ? "Microphone access failed" : "Voice message"}
            >
                {micError ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}

          <button
            onClick={() => handleSend()}
            disabled={isLoading || isRecording || !inputText.trim()}
            className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;