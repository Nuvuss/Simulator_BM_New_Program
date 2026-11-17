'use client';

interface TypingIndicatorProps {
  leadName: string;
}

export function TypingIndicator({ leadName }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start mb-2 px-3 animate-fade-in">
      <div className="bg-white rounded-lg rounded-tl-none px-3.5 py-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#667781] italic">
            {leadName} sedang mengetik
          </span>
          <div className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 bg-[#667781] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-[#667781] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-[#667781] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
