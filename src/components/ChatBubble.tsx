'use client';

interface ChatBubbleProps {
  sender: 'bm' | 'lead';
  text: string;
  timestamp: string;
}

export function ChatBubble({ sender, text, timestamp }: ChatBubbleProps) {
  const isBM = sender === 'bm';
  const isSystemTimeout = !isBM && text.startsWith('⏱');
  const time = new Date(timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });

  if (isSystemTimeout) {
    return (
      <div className="flex justify-center my-3 px-4 animate-message-in">
        <div className="bg-amber-50/95 border border-amber-200 text-amber-900 text-xs font-medium px-3.5 py-2 rounded-xl shadow-xs text-center flex items-center gap-2">
          <span>{text}</span>
          <span className="text-[10px] text-amber-700/80 font-normal">{time}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isBM ? 'justify-end' : 'justify-start'} mb-2 px-3 animate-message-in`}>
      <div
        className={`relative max-w-[80%] sm:max-w-[70%] px-3 py-2 rounded-lg shadow-sm ${
          isBM
            ? 'bg-[#DCF8C6] rounded-tr-none'
            : 'bg-white rounded-tl-none'
        }`}
      >
        <p className="text-sm text-[#111B21] whitespace-pre-wrap break-words leading-relaxed">
          {text}
        </p>
        <div className="flex justify-end items-center mt-1 gap-1">
          <span className="text-[10px] text-[#667781]">{time}</span>
          {isBM && (
            <svg className="w-4 h-3 text-[#53BDEB]" viewBox="0 0 16 11" fill="currentColor">
              <path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.011-2.095a.463.463 0 0 0-.34-.15.456.456 0 0 0-.312.114.493.493 0 0 0-.163.34.455.455 0 0 0 .119.342l2.344 2.394a.465.465 0 0 0 .341.15.45.45 0 0 0 .345-.157l6.533-8.056a.468.468 0 0 0 .1-.353.45.45 0 0 0-.18-.326z" />
              <path d="M14.757.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.382.178l-6.19 7.636-1.166-1.214-.312.39 1.146 1.17a.465.465 0 0 0 .341.15.45.45 0 0 0 .345-.157l6.533-8.056a.468.468 0 0 0 .102-.353.452.452 0 0 0-.182-.326z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
