export interface ChatMessageData {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

interface Props {
  message: ChatMessageData;
}

/** Chat bubble icon (inline SVG from merge.html) */
const AgentAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
    <svg
      className="w-4 h-4 text-brand"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  </div>
);

export default function ChatMessage({ message }: Props) {
  const isAgent = message.sender === 'agent';

  if (isAgent) {
    return (
      <div className="flex gap-2 mb-4">
        <AgentAvatar />
        <div
          className="px-3 py-2 max-w-[75%]"
          style={{
            background: '#2A2D2D',
            borderRadius: '4px 12px 12px 12px',
          }}
        >
          <p className="text-white text-sm">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mb-4 justify-end">
      <div
        className="px-3 py-2 max-w-[75%]"
        style={{
          background: '#24EE89',
          borderRadius: '12px 4px 12px 12px',
        }}
      >
        <p className="text-sm" style={{ color: '#1A1D1D' }}>
          {message.text}
        </p>
      </div>
    </div>
  );
}

/** Typing indicator: 3 bouncing dots */
export function TypingIndicator() {
  return (
    <div className="flex gap-2 mb-4">
      <AgentAvatar />
      <div
        className="px-3 py-2.5"
        style={{
          background: '#2A2D2D',
          borderRadius: '4px 12px 12px 12px',
        }}
      >
        <div className="flex gap-1">
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ background: '#6B7070', animationDelay: '0ms' }}
          />
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ background: '#6B7070', animationDelay: '150ms' }}
          />
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ background: '#6B7070', animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}
