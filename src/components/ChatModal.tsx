import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldCheck, UserCheck } from 'lucide-react';
import { ChatMessage, FoodListing } from '../types';

interface ChatModalProps {
  listing: FoodListing;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ listing, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`chat_${listing.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'msg-init',
        listingId: listing.id,
        sender: 'poster',
        senderName: listing.posterName,
        text: `Namaste! Thanks for reaching out about "${listing.title}". Please feel free to ask about pickup timing or food preparation!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(`chat_${listing.id}`, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, listing.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      listingId: listing.id,
      sender: 'user',
      senderName: 'You',
      text: inputVal.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputVal.trim();
    setInputVal('');

    // Simulate realistic responsive neighbor reply
    setIsTyping(true);
    setTimeout(() => {
      let replyText = `Thank you! I am right here at ${listing.locationName}. You can come by during ${listing.pickupWindow}.`;
      const lower = currentInput.toLowerCase();
      if (lower.includes('dabba') || lower.includes('tiffin') || lower.includes('box') || lower.includes('bag')) {
        replyText = `Wonderful! Bringing your own dabba is really appreciated, it keeps the food warm and reduces plastic waste!`;
      } else if (lower.includes('veg') || lower.includes('jain') || lower.includes('onion') || lower.includes('garlic')) {
        replyText = `Yes, this is 100% prepared with clean vegetarian standards (${listing.dietaryTags.join(', ')}). No contamination at all.`;
      } else if (lower.includes('gate') || lower.includes('security') || lower.includes('flat')) {
        replyText = `Yes, you can collect from the apartment security gate. Just tell them your SharePlate pass code!`;
      } else if (lower.includes('time') || lower.includes('now') || lower.includes('reach') || lower.includes('min')) {
        replyText = `Sounds great, see you soon! Please call or message once you reach the gate.`;
      }

      const hostReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        listingId: listing.id,
        sender: 'poster',
        senderName: listing.posterName,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, hostReply]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full h-[580px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              {listing.posterName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {listing.posterName}
                </h3>
                {listing.verifiedBusiness ? (
                  <span title="Verified food establishment">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                  </span>
                ) : (
                  <span title="Neighbor resident">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500 inline" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">
                {listing.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
          <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-slate-600 text-[11px] space-y-1">
            <div className="font-semibold text-slate-800">{listing.title}</div>
            <div className="text-slate-500">
              📍 {listing.locationName} · 🕒 {listing.pickupWindow}
            </div>
          </div>

          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-baseline gap-1.5 mb-1 px-1">
                  <span className="font-semibold text-[11px] text-slate-600">{m.senderName}</span>
                  <span className="text-[10px] text-slate-400 tabular-nums">{m.timestamp}</span>
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs italic px-2">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-150">●</span>
              <span className="animate-pulse delay-300">●</span>
              <span>{listing.posterName} is replying...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <button
            type="button"
            onClick={() => setInputVal('I am bringing my own steel dabba / bag 🍱')}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 whitespace-nowrap cursor-pointer"
          >
            Bringing own dabba 🍱
          </button>
          <button
            type="button"
            onClick={() => setInputVal('Can I pick up in 15 minutes?')}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 whitespace-nowrap cursor-pointer"
          >
            Pick up in 15 mins?
          </button>
          <button
            type="button"
            onClick={() => setInputVal('Can I collect from your society security gate?')}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 whitespace-nowrap cursor-pointer"
          >
            Society security gate pickup?
          </button>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message to your neighbor..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 text-xs py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
