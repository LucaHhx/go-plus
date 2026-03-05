import { useState, useRef, useEffect, useCallback } from 'react';
import ChatMessage, {
  TypingIndicator,
  type ChatMessageData,
} from './ChatMessage';
import { getAutoReply, getWelcomeMessage, getReplyDelay } from './MockAutoReply';

interface Props {
  open: boolean;
  onClose: () => void;
}

let messageIdCounter = 0;
function nextId() {
  return `msg-${++messageIdCounter}`;
}

function formatTime(): string {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `Today ${h12}:${m} ${period}`;
}

export default function LiveChatWidget({ open, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessageData[]>(() => [
    {
      id: nextId(),
      text: getWelcomeMessage(),
      sender: 'agent',
      timestamp: formatTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessageData = {
      id: nextId(),
      text,
      sender: 'user',
      timestamp: formatTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Show typing indicator, then auto-reply
    setTyping(true);
    const delay = getReplyDelay();
    setTimeout(() => {
      const reply: ChatMessageData = {
        id: nextId(),
        text: getAutoReply(text),
        sender: 'agent',
        timestamp: formatTime(),
      };
      setTyping(false);
      setMessages((prev) => [...prev, reply]);
    }, delay);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasInput = input.trim().length > 0;

  return (
    <div
      className={`fixed inset-0 z-[70] max-w-[430px] mx-auto ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Chat Panel */}
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl flex flex-col"
        style={{
          height: '85vh',
          background: '#232626',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 h-12 flex-shrink-0"
          style={{ borderBottom: '1px solid #3A3D3D' }}
        >
          <h2 className="text-white font-bold text-sm">Live Support</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              style={{ color: '#6B7070' }}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{ height: 'calc(85vh - 48px - 56px)' }}
        >
          {/* Timestamp */}
          {messages.length > 0 && (
            <p
              className="text-center mb-4"
              style={{ fontSize: '10px', color: '#6B7070' }}
            >
              {messages[0].timestamp}
            </p>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {typing && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div
          className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
          style={{ borderTop: '1px solid #3A3D3D' }}
        >
          <div
            className="flex-1 flex items-center rounded-full h-10 px-4"
            style={{ background: '#2A2D2D' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-white text-sm border-none outline-none"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!hasInput}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors"
            style={{
              background: hasInput ? '#24EE89' : '#3A3D3D',
            }}
          >
            <svg
              className="w-5 h-5"
              style={{ color: hasInput ? '#1A1D1D' : '#6B7070' }}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
