'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatBubble } from '@/components/ChatBubble';
import { ChatInput } from '@/components/ChatInput';
import { TypingIndicator } from '@/components/TypingIndicator';
import { leads } from '@/data/leads';
import {
  initSection,
  processReply,
  handleTimeout,
  moveToNextLead,
  getRemainingTime,
  isTimedOut,
} from '@/lib/examEngine';
import { saveExamState, loadExamState } from '@/lib/storage';
import { ExamState, ChatMessage } from '@/types';

export default function ExamPage() {
  const router = useRouter();
  const [examState, setExamState] = useState<ExamState | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [screenTransition, setScreenTransition] = useState<'slide-out' | 'slide-in' | null>(null);
  const [transitionOverlay, setTransitionOverlay] = useState<{
    text: string;
    subtext?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const timeoutLockRef = useRef<string | null>(null);

  // Animate opening messages (show msg 1 immediately, msg 2 after delay)
  const animateOpeningMessages = useCallback((state: ExamState) => {
    const currentMessages = state.messages.filter(
      (m) => m.sectionIndex === state.currentLeadIndex
    );

    if (currentMessages.length >= 2) {
      // Show first message smoothly after slight pause for clean entrance
      setTimeout(() => {
        setDisplayMessages([currentMessages[0]]);
      }, 150);

      // Show typing indicator then second message
      setTimeout(() => {
        setIsTyping(true);
      }, 750);

      setTimeout(() => {
        setIsTyping(false);
        setDisplayMessages([currentMessages[0], currentMessages[1]]);
      }, 2250);
    }
  }, []);

  // Load or redirect
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const state = loadExamState();
    if (!state) {
      router.push('/');
      return;
    }

    if (state.status === 'completed') {
      router.push('/thankyou');
      return;
    }

    // If section hasn't started yet (phase === 'greeting' and no start time), show pop-up before starting!
    if (state.phase === 'greeting' && !state.sectionStartTime) {
      setExamState(state);
      setShowWelcomeModal(true);
    } else {
      setExamState(state);
      // Show all existing messages for current section
      const currentMessages = state.messages.filter(
        (m) => m.sectionIndex === state.currentLeadIndex
      );
      setDisplayMessages(currentMessages);
    }
  }, [router]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayMessages, isTyping]);

  const handleTimerExpired = useCallback(() => {
    if (
      !examState ||
      !examState.sectionStartTime ||
      showWelcomeModal ||
      Boolean(transitionOverlay) ||
      examState.phase === 'done' ||
      examState.phase === 'booking-confirm' ||
      examState.phase === 'greeting'
    )
      return;

    const lockKey = `${examState.currentLeadIndex}-${examState.sectionStartTime}`;
    if (timeoutLockRef.current === lockKey) return;
    timeoutLockRef.current = lockKey;

    const newState = handleTimeout(examState);
    setExamState(newState);
    saveExamState(newState);

    // Add timeout message to display
    const timeoutMsg = newState.messages[newState.messages.length - 1];
    setDisplayMessages((prev) => [...prev, timeoutMsg]);

    // Move to next lead or complete
    setTimeout(() => {
      const nextIndex = newState.currentLeadIndex + 1;
      if (nextIndex >= leads.length) {
        const nextState = moveToNextLead(newState);
        setExamState(nextState);
        saveExamState(nextState);
        submitAndRedirect(nextState);
      } else {
        const nextLead = leads[nextIndex];

        // 1. Slide out current chat screen to the left
        setScreenTransition('slide-out');

        setTimeout(() => {
          setTransitionOverlay({
            text: `Waktu Sesi ${newState.currentLeadIndex + 1} Berakhir`,
            subtext: `Menyiapkan Sesi ${nextIndex + 1} (${nextLead.name})...`,
          });
        }, 100);

        setTimeout(() => {
          const nextState = moveToNextLead(newState);
          setExamState(nextState);
          saveExamState(nextState);
          setDisplayMessages([]);
          setIsTyping(false);
          setTransitionOverlay(null);
          setScreenTransition('slide-in');
          setShowWelcomeModal(true);

          setTimeout(() => {
            setScreenTransition(null);
          }, 400);
        }, 1200);
      }
    }, 1800);
  }, [examState, showWelcomeModal, transitionOverlay]);

  // Timer check
  useEffect(() => {
    if (
      !examState ||
      examState.phase === 'done' ||
      examState.phase === 'booking-confirm' ||
      examState.phase === 'greeting' ||
      showWelcomeModal ||
      Boolean(transitionOverlay) ||
      !examState.sectionStartTime
    )
      return;

    const interval = setInterval(() => {
      if (isTimedOut(examState)) {
        handleTimerExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [examState, showWelcomeModal, transitionOverlay, handleTimerExpired]);

  const handleSend = useCallback(
    (text: string) => {
      if (
        !examState ||
        isTyping ||
        examState.phase === 'done' ||
        examState.phase === 'booking-confirm' ||
        showWelcomeModal
      )
        return;

      const { state: newState, leadResponse, sectionComplete } = processReply(examState, text);

      // Add candidate message to display immediately
      const currentSectionMessages = newState.messages.filter(
        (m) => m.sectionIndex === newState.currentLeadIndex
      );
      if (leadResponse) {
        setDisplayMessages(currentSectionMessages.slice(0, -1));
      } else {
        setDisplayMessages(currentSectionMessages);
      }

      setExamState(newState);
      saveExamState(newState);

      // Animate lead response with typing indicator
      if (leadResponse) {
        const delay = 1500 + Math.random() * 1500; // 1.5-3s delay

        setTimeout(() => {
          setIsTyping(true);
        }, 300);

        setTimeout(() => {
          setIsTyping(false);
          const updatedMessages = newState.messages.filter(
            (m) => m.sectionIndex === newState.currentLeadIndex
          );
          setDisplayMessages(updatedMessages);

          if (sectionComplete) {
            setTimeout(() => {
              const nextIndex = newState.currentLeadIndex + 1;
              if (nextIndex >= leads.length) {
                const nextState = moveToNextLead(newState);
                setExamState(nextState);
                saveExamState(nextState);
                submitAndRedirect(nextState);
              } else {
                const nextLead = leads[nextIndex];

                // 1. Slide out current chat screen to the left
                setScreenTransition('slide-out');

                setTimeout(() => {
                  setTransitionOverlay({
                    text: `Sesi ${newState.currentLeadIndex + 1} Selesai!`,
                    subtext: `Menyiapkan Sesi ${nextIndex + 1} (${nextLead.name})...`,
                  });
                }, 100);

                setTimeout(() => {
                  const nextState = moveToNextLead(newState);
                  setExamState(nextState);
                  saveExamState(nextState);
                  setDisplayMessages([]);
                  setIsTyping(false);
                  setTransitionOverlay(null);
                  setScreenTransition('slide-in');
                  setShowWelcomeModal(true);

                  setTimeout(() => {
                    setScreenTransition(null);
                  }, 400);
                }, 1200);
              }
            }, 1800);
          }
        }, delay);
      }
    },
    [examState, isTyping, showWelcomeModal, transitionOverlay]
  );

  const submitAndRedirect = async (state: ExamState) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.messages,
          candidateName: state.candidateName,
          candidateEmail: state.candidateEmail,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        console.warn('Google Sheets submission warning:', result.error);
      }
    } catch (error) {
      console.error('Failed to submit transcript:', error);
    }

    const completedState = { ...state, status: 'completed' as const };
    saveExamState(completedState);
    router.push('/thankyou');
  };

  const handleConfirmStart = () => {
    if (!examState || isModalClosing) return;
    setIsModalClosing(true);

    setTimeout(() => {
      setShowWelcomeModal(false);
      setIsModalClosing(false);
      const newState = initSection(examState);
      setExamState(newState);
      saveExamState(newState);
      animateOpeningMessages(newState);
    }, 240);
  };

  // Loading state
  if (!examState) {
    return (
      <div className="min-h-dvh bg-white sm:bg-gray-100 flex items-center justify-center p-0 sm:py-3 sm:px-4 font-sans">
        <div className="w-full sm:max-w-[420px] h-dvh sm:h-[94vh] sm:max-h-[860px] bg-white sm:rounded-[32px] sm:shadow-2xl sm:border-[6px] sm:border-gray-800 flex flex-col items-center justify-center p-6 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#25D366] border-t-transparent rounded-full mb-4" />
          <p className="text-gray-600 font-medium">Memuat simulasi ujian...</p>
        </div>
      </div>
    );
  }

  // Submitting state
  if (isSubmitting) {
    return (
      <div className="min-h-dvh bg-white sm:bg-gray-100 flex items-center justify-center p-0 sm:py-3 sm:px-4 font-sans">
        <div className="w-full sm:max-w-[420px] h-dvh sm:h-[94vh] sm:max-h-[860px] bg-[#075E54] text-white sm:rounded-[32px] sm:shadow-2xl sm:border-[6px] sm:border-gray-800 flex flex-col items-center justify-center p-6 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mb-4" />
          <h2 className="text-xl font-bold mb-2">Mengirim Hasil...</h2>
          <p className="text-green-200 text-sm">Sedang memproses hasil tes Anda. Mohon tunggu sebentar.</p>
        </div>
      </div>
    );
  }

  const currentLead = leads[examState.currentLeadIndex] || leads[0];
  const remaining = getRemainingTime(examState);
  const isSectionDone = examState.phase === 'done' || examState.phase === 'booking-confirm';
  const isTimerRunning = Boolean(
    examState.sectionStartTime &&
    !showWelcomeModal &&
    !transitionOverlay &&
    !isSectionDone
  );
  const timerKey = `${examState.currentLeadIndex}-${examState.sectionStartTime ?? 'idle'}`;

  return (
    <div className="min-h-dvh bg-white sm:bg-gray-100 flex items-center justify-center p-0 sm:py-3 sm:px-4 font-sans relative">
      {/* Smooth Transition Overlay Between Sessions */}
      {transitionOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xs w-full text-center shadow-2xl border border-gray-100 flex flex-col items-center animate-slide-in-right">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-3 shadow-xs">
              <div className="w-6 h-6 border-3 border-[#075E54] border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">
              {transitionOverlay.text}
            </h3>
            {transitionOverlay.subtext && (
              <p className="text-xs text-gray-600 leading-relaxed">
                {transitionOverlay.subtext}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Pop Up: Selamat Mengerjakan */}
      {showWelcomeModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs ${isModalClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'
            }`}
        >
          <div
            className={`bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-gray-100 ${isModalClosing ? 'animate-modal-slide-out-left' : 'animate-modal-slide-in-right'
              }`}
          >
            {/* Header: Session Badge & Title */}
            <div className="text-center mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 mb-2">
                Sesi {examState.currentLeadIndex + 1} dari {leads.length}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Selamat Mengerjakan!
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Kandidat: <span className="font-medium text-gray-700">{examState.candidateName}</span>
              </p>
            </div>

            {/* Key-Value Block: Lead Info */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 mb-3.5 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-gray-500 shrink-0">Calon Siswa</span>
                <span className="font-semibold text-gray-900 text-right">{currentLead.name}</span>
              </div>
              <div className="flex items-start justify-between gap-2 border-t border-slate-200/60 pt-2">
                <span className="text-gray-500 shrink-0">Profil / Peran</span>
                <span className="font-medium text-gray-800 text-right">{currentLead.profile}</span>
              </div>
              <div className="flex items-start justify-between gap-2 border-t border-slate-200/60 pt-2">
                <span className="text-gray-500 shrink-0">Program Minat</span>
                <span className="font-medium text-[#075E54] text-right">{currentLead.program}</span>
              </div>
            </div>

            {/* Two Short Rows: Time & Rule */}
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex items-center gap-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-lg px-3 py-2 text-emerald-900">
                <span className="text-sm">⏱</span>
                <div className="flex-1 leading-tight text-[11px]">
                  <span className="font-semibold">Alokasi Waktu:</span> 20 Menit (timer mulai saat klik tombol)
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg px-3 py-2 text-amber-900">
                <span className="text-sm mt-0.5">🚨</span>
                <div className="flex-1 leading-tight text-[11px]">
                  <span className="font-semibold text-amber-950">Aturan 1 Bubble:</span> Gabungkan seluruh poin & penawaran dalam 1 kali kirim.
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleConfirmStart}
              disabled={isModalClosing}
              className="w-full h-11 bg-[#E7000B] hover:bg-[#C8000A] active:scale-[0.99] text-white font-bold px-6 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
            >
              <span>Mulai Chat Sekarang</span>
              <span className="text-base">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Clean Simulator Container (No fake phone hardware) */}
      <div className="w-full sm:max-w-[420px] h-dvh sm:h-[94vh] sm:max-h-[860px] flex flex-col bg-[#ECE5DD] sm:rounded-2xl sm:shadow-xl overflow-hidden sm:border sm:border-gray-200/90 relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">

        {/* Real Assessment Metadata Bar */}
        <div className="bg-[#054C44] text-white/90 px-3.5 py-1 text-[11px] flex items-center justify-between border-b border-black/10 select-none flex-shrink-0">
          <span className="truncate text-emerald-100">
            Kandidat: <strong className="text-white font-medium">{examState.candidateName}</strong>
          </span>
          <span className="text-[11px] font-semibold text-emerald-200 flex-shrink-0 ml-2">
            Sesi {examState.currentLeadIndex + 1} dari {leads.length}
          </span>
        </div>

        {/* Active Chat Screen with Lateral Horizontal Slide Transition */}
        <div
          className={`flex-1 flex flex-col min-h-0 overflow-hidden ${screenTransition === 'slide-out'
            ? 'animate-screen-slide-out-left'
            : screenTransition === 'slide-in'
              ? 'animate-screen-slide-in-right'
              : ''
            }`}
        >
          {/* WhatsApp Chat Header */}
          <ChatHeader
            leadName={currentLead.name}
            leadProfile={currentLead.profile}
            remainingTime={remaining}
            totalTime={currentLead.timeLimitSec || 1200}
            onTimeout={handleTimerExpired}
            sectionLabel={`${examState.currentLeadIndex + 1}/${leads.length}`}
            isTimerRunning={isTimerRunning}
            timerKey={timerKey}
          />

          {/* Chat Messages Body */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto wa-chat-bg chat-scroll py-3"
          >
            {/* Date pill */}
            <div className="flex justify-center mb-3">
              <span className="bg-white/85 text-[#667781] text-[11px] px-3 py-1 rounded-lg shadow-xs select-none">
                Hari ini
              </span>
            </div>

            {/* Program context badge */}
            <div className="flex justify-center mb-3 px-4">
              <span className="bg-[#FFF3CD] border border-[#FFEEBA] text-[#856404] text-[11px] px-3 py-1.5 rounded-lg shadow-xs text-center leading-tight">
                🎓 <strong>Program:</strong> {currentLead.program} • <em>{currentLead.source}</em>
              </span>
            </div>

            {/* Messages */}
            {displayMessages.map((msg) => (
              <ChatBubble
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
                timestamp={msg.timestamp}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator leadName={currentLead.name} />}

            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Input Bar */}
          <ChatInput
            onSend={handleSend}
            disabled={isTyping || isSectionDone || showWelcomeModal || Boolean(transitionOverlay)}
            placeholder={
              isSectionDone
                ? 'Sesi telah berakhir'
                : 'Ketik pesan...'
            }
          />
        </div>
      </div>
    </div>
  );
}
