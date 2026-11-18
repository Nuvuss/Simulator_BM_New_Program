'use client';

import { useRouter } from 'next/navigation';
import { loadExamState } from '@/lib/storage';
import { useEffect, useState } from 'react';

export default function InstructionsPage() {
  const router = useRouter();
  const [candidateName, setCandidateName] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const state = loadExamState();
    if (!state) {
      router.push('/');
      return;
    }
    setCandidateName(state.candidateName);
  }, [router]);

  const handleStart = () => {
    setIsStarting(true);
    router.push('/exam');
  };

  return (
    <div className="min-h-dvh bg-white flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl shadow-gray-100 max-w-lg w-full p-6 sm:p-8">
        {/* Header with RevoU logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-white p-1 shadow-md border border-gray-100 mb-3">
            <img
              src="/revou-logo.png"
              alt="RevoU Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-gray-800 bg-[#FFF3CD] border border-[#FFEEBA] mb-2 shadow-2xs">
            <span>📋</span>
            <span>Panduan Peserta</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
            Informasi Sebelum Mengerjakan Tes
          </h1>
          {candidateName && (
            <div className="mt-1">
              <p className="text-sm text-gray-600">
                Halo, <span className="font-bold text-[#E7000B]">{candidateName}</span>! Harap baca informasi berikut sebelum memulai ujian.
              </p>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="mt-1 text-xs text-gray-500 hover:text-gray-800 underline transition-colors cursor-pointer"
              >
                ← Ubah data diri
              </button>
            </div>
          )}
        </div>

        {/* Content points */}
        <div className="space-y-3.5 mb-6 text-sm text-gray-700">
          <div className="bg-[#FFF9E6] border border-[#FFE58F] rounded-2xl p-4">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <span>🎯</span> Peran Anda
            </h3>
            <p className="text-xs leading-relaxed text-gray-700">
              Anda berperan sebagai <strong>Booking Manager (Admission Executive)</strong> RevoU.
              Tugas Anda adalah merespon pertanyaan dan keberatan calon siswa melalui chat WhatsApp, lalu mengajak mereka booking sesi konsultasi dengan Admission Counselor (AC).
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2 text-xs">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2 text-sm">
              <span>⏱</span> Aturan Sesi
            </h3>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#E7000B]">1.</span>
              <span>
                Kamu akan berhadapan dengan bot yang berperan sebagai <strong>4 calon siswa (lead)</strong> dengan profil yang berbeda secara berurutan: <strong>Staff Marketing untuk Applied AI, Analytics & Automation RevoU x BINUS</strong>, <strong>Kepala Sekolah untuk Data-Driven Decision Making for Leaders RevoU x ITB</strong>, <strong>Credit Analyst untuk Applied Data Science with AI RevoU x ITB</strong>, dan <strong>Account Payable untuk AI-Enabled Strategic Finance RevoU x UI</strong>.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#E7000B]">2.</span>
              <span>
                Baca & pahami dahulu keempat program sesuai yang disebutkan poin 1 di situs web RevoU (<a href="https://revou.co" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium hover:text-blue-800">revou.co</a>). Perhatikan kurikulum, learning journey, dan kisah atau portofolio para alumni, sehingga Anda dapat menanggapi leads tersebut dengan percaya diri.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#E7000B]">3.</span>
              <span>Gunakan bahasa Indonesia yang ramah, profesional, dan persuasif.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#E7000B]">4.</span>
              <span>Batas waktu chat dengan tiap lead adalah <strong>20 menit</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#E7000B]">5.</span>
              <div className="space-y-1.5 flex-1">
                <span>🚨 Kamu hanya bisa memberikan respon dengan <strong>1 bubble chat</strong>. Pastikan informasi, urgency, dan call to action yang ingin kamu sampaikan sudah tercantum langsung dalam 1 bubble chat sebelum kamu kirim.</span>
                <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 text-[11px] text-gray-700 leading-relaxed mt-1">
                  <span className="font-bold text-amber-900 block mb-1.5">💡 Contoh:</span>
                  <div className="space-y-2 italic text-gray-800">
                    <p>
                      &ldquo;Halo Pak 😊 Baik.. Saat ini memimpin cabang di industri telekomunikasi dan membawahi 4 divisi Sales, HR, Operation, dan New Roll Out ya pak. Baik.. itu tanggung jawab yg kompleks ya pak.. Sudah pasti keputusan bisnis harian, dan sinkronisasi data antar tim mungkin cukup menantang.
                    </p>
                    <p>
                      Nah, di program ini bapak akan belajar AI diposisikan sebagai &apos;force multiplier&apos; utk kepemimpinan bpk, bukan pengganti intuisi bisnis 🚀 Program ini tanpa koding, fokus pada Decision Framing, perancangan Custom AI Assistant manajerial, hingga simulasi Executive Data Review. Di akhir sesi, Bpk bisa membawa tantangan riil di cabang kantor bapak jd Capstone Project. Sehingga selesai program sudah bawah playbook yg siap eksekusi, dan dapat ITB Certificate Course resmi.
                    </p>
                    <p>
                      Berkenan aku bantu kirimkan rincian silabus lengkapnya dan atur sesi ngobrol santai 1:1 via konsultasi gratis Pak? Siapa tahu bisa jadi bekal berharga untuk akselerasi performa cabang bapak ✨&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStart}
          disabled={isStarting}
          className="w-full bg-[#E7000B] hover:bg-[#C8000A] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-85"
        >
          {isStarting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Menyiapkan Ujian...</span>
            </>
          ) : (
            <>
              <span>Mulai Simulasi Tes</span>
              <span className="text-lg">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
