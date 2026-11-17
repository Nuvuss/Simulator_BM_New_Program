'use client';

import { Timer } from './Timer';

interface ChatHeaderProps {
  leadName: string;
  leadProfile: string;
  remainingTime: number;
  onTimeout: () => void;
  sectionLabel: string;
  isTimerRunning?: boolean;
  timerKey?: string;
}

export function ChatHeader({
  leadName,
  leadProfile,
  remainingTime,
  onTimeout,
  sectionLabel,
  isTimerRunning = true,
  timerKey,
}: ChatHeaderProps) {
  return (
    <div className="bg-[#075E54] text-white px-3.5 py-2.5 flex items-center justify-between shadow-md z-20 flex-shrink-0 select-none">
      {/* Left side: Profile Picture, Name & Status */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* RevoU Profile Photo */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/20 bg-[#FFDE3D] shadow-sm">
          <img
            src="/revou-logo.png"
            alt="RevoU"
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border-2 border-[#075E54] rounded-full" />
        </div>

        {/* Name and Info */}
        <div className="min-w-0 flex-1 transition-all duration-300">
          <div className="flex items-center gap-1.5">
            <h2 className="font-semibold text-sm sm:text-base leading-tight truncate transition-all duration-300">
              {leadName}
            </h2>
            <span className="text-[10px] bg-[#128C7E] text-white px-1.5 py-0.5 rounded font-medium flex-shrink-0">
              RevoU
            </span>
          </div>
          <p className="text-[11px] text-green-100/90 leading-tight truncate transition-all duration-300">
            online • <span className="text-green-200">{leadProfile}</span>
          </p>
        </div>
      </div>

      {/* Right side: Session badge & Timer */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <span className="text-[11px] font-semibold bg-[#128C7E] text-white px-2 py-0.5 rounded-full transition-all duration-300">
          {sectionLabel}
        </span>
        <Timer
          key={timerKey}
          remainingTime={remainingTime}
          onTimeout={onTimeout}
          isRunning={isTimerRunning}
        />
      </div>
    </div>
  );
}
