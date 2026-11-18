import { Lead } from '@/types';

export const leads: Lead[] = [
  {
    id: 'aliya',
    name: 'Aliya',
    age: 24,
    profile: 'Staff Marketing di perusahaan otomotif Jepang',
    program: 'Applied AI Analytics & Automation RevoU x BINUS',
    source: 'Application form',
    avatar: '👩',
    openingBM:
      'Hi Kak Aliya, salam kenal 🙂 aku Admission Counselor RevoU. Aku lihat Kakak tertarik dengan program *Applied AI, Analytics & Automation – RevoU x BINUS* ya. Thank you yaa..\n\nProgram ini adalah kolaborasi industri & universitas, di mana RevoU bekerja sama dgn BINUS University. Kurikulum berbasis industri yg cocok utk bisa *AI & Automation tanpa harus bisa coding*\n\nKalo boleh share, sekarang lagi kerja sebagai apa atau mungkin baru lulus kuliah kah kak?',
    openingLead:
      'Halo kak. Aku sekarang kerja sebagai staff marketing di perusahaan otomotif Jepang. Pengen belajar AI soalnya kyknya penting skrg bisa AI. Ini programnya berapa lama ya?',
    questions: [
      {
        seq: 1,
        type: 'question' as const,
        text: 'Kelasnya jadwalnya kapan aja kak? Aku kerja shift di kantorku, kadang pagi kadang sore.',
      },
      {
        seq: 2,
        type: 'question' as const,
        text: 'Nanti belajarnya praktek langsung atau teori aja? Soalnya aku takut sulit pahamnya',
      },
      {
        seq: 3,
        type: 'question' as const,
        text: 'Ada contoh portofolio/tugasnya kyk gimana ga kak?',
      },
      {
        seq: 4,
        type: 'objection' as const,
        text: 'Biayanya berapa ya kak? Takutnya ga kejangkau.',
      },
      {
        seq: 5,
        type: 'objection' as const,
        text: 'Aku pikir-pikir dulu deh kak, kayaknya mau coba belajar sendiri dari YouTube dulu.',
      },
    ],
    bookingRequest:
      'Oke kak, makasih penjelasannya! Aku mau deh ngobrol lebih lanjut sama Counselor-nya. Kapan ya kak bisa jadwalnya?',
    bookingConfirm:
      'Siap kak, sudah aku catat ya! Nanti Counselor RevoU yang hubungi aku ya. Makasih banyak kak! 🙏',
    timeLimitSec: 1200,
  },
  {
    id: 'tomo',
    name: 'Tomo',
    age: 40,
    profile: 'Kepala sekolah di sekolah swasta di Jakarta Selatan',
    program: 'Data-Driven Decision Making for Leaders RevoU x ITB',
    source: 'Brochure download',
    avatar: '👨‍💼',
    openingBM:
      'Hi Pak Tomo, salam kenal 😊 aku Admission Counselor RevoU. Aku lihat Bpk tertarik dengan program *Data-Driven Decision Making for Leaders – RevoU x ITB*\n\nThank you yaa.. Program ini adalah kolaborasi industri & universitas, yaitu ITB. Program akan memberikan kurikulum berbasis industri yg cocok utk *memaksimalkan penggunaan AI utk decision making yg lebih tajam dalam tim.* 🧑‍💼\n\nKalau boleh tau, saat ini kerja di role sebagai apa dan di tim apa Pak?',
    openingLead:
      'Halo, saya kepala sekolah di sekolah swasta Jakarta Selatan. Ini programnya cocok gak buat saya?',
    questions: [
      {
        seq: 1,
        type: 'question' as const,
        text: 'Sertifikatnya dari ITB atau dari RevoU?',
      },
      {
        seq: 2,
        type: 'question' as const,
        text: 'Alumni-alumni sebelumnya ada yg seperti saya gak kak? Atau biasanya profilnya seperti apa yg ikut? Nanti saya tua sendiri lg kak',
      },
      {
        seq: 3,
        type: 'question' as const,
        text: 'Yg ngajar siapa aja kak?',
      },
      {
        seq: 4,
        type: 'objection' as const,
        text: 'Jujur saya sibuk banget, meeting bisa sampai malam. Takut ga bisa ngikutin kelasnya.',
      },
      {
        seq: 5,
        type: 'objection' as const,
        text: 'Kantor saya mungkin bisa reimburse, tapi harus diajukan dulu. Bisa kirim detail biaya dan proposal aja dulu ga, sebelum konsultasi?',
      },
    ],
    bookingRequest:
      'Baik Pak/Bu, penjelasannya cukup jelas. Kalau begitu saya jadwalkan konsultasi dengan Counselor terlebih dahulu. Kapan waktunya yang tersedia?',
    bookingConfirm:
      'Baik, terima kasih. Nanti dihubungi oleh Counselor RevoU ya. Terima kasih banyak atas bantuannya 🙏',
    timeLimitSec: 1200,
  },
  {
    id: 'burhan',
    name: 'Burhan',
    age: 32,
    profile: 'Credit Analyst di perusahaan e-wallet.',
    program: 'Applied Data Science with AI RevoU x ITB',
    source: 'Application form',
    avatar: '👨',
    openingBM:
      'Hai Kak Burhan! Salam kenal aku Admission Counselor untuk program *Applied Data Science with AI - RevoU × ITB* 🙌 Makasih banyak udh tertarik dgn programnya 😊\n\nSingkatnya, ini program advanced yg cocok utk analyst yg udh biasa report & explore data, dan skrg mau naik level: bangun *predictive model & AI-enabled data product* 🎓\n\nSupaya aku bisa bantu konsultasi lebih tepat, boleh cerita dikit Kak: *saat ini role-nya apa, dan sehari-hari udh kerja dgn data seperti apa?* (misal SQL, dashboard, Python)',
    openingLead:
      'Sore kak, saya udh bisa SQL dan udh kerja sebagai analyst juga. Saat ini kerja sebagai Credit Analyst di perusahaan e-wallet. Ini programnya tuh gimana ya kak?',
    questions: [
      {
        seq: 1,
        type: 'question' as const,
        text: 'Belajarnya pakai tools apa kak AI-nya?',
      },
      {
        seq: 2,
        type: 'question' as const,
        text: 'Programnya berapa lama kak dan gimana jadwalnya? Aku sambil kerja juga soalnya.',
      },
      {
        seq: 3,
        type: 'question' as const,
        text: 'Sertifikatnya nanti dari RevoU atau gimana?',
      },
      {
        seq: 4,
        type: 'objection' as const,
        text: 'Aku masih level junior kerjanya kak, masih minta bantu finansial dr ortu. Harus izin dulu sama mereka.',
      },
      {
        seq: 5,
        type: 'objection' as const,
        text: 'Temen aku bilang mending ambil sertifikasi online dari AWS aja, lebih murah. Bedanya apa kak?',
      },
    ],
    bookingRequest:
      'Oke kak mantap, jelas banget. Boleh aku atur sesi konsultasi bareng Counselor-nya dulu. Jadwalnya kapan aja ya kak?',
    bookingConfirm:
      'Oke kak, sudah aku catat ya. Ditunggu kontak dari Counselor RevoU. Thank you kak! 🙌',
    timeLimitSec: 1200,
  },
  {
    id: 'ika',
    name: 'Ika',
    age: 30,
    profile: 'Account Payable di kantor udh 5th, kantor bidang Retail',
    program: 'AI-Enabled Strategic Finance RevoU x UI',
    source: 'Brochure download',
    avatar: '👩‍💼',
    openingBM:
      'Hai Kak Ika! Salam kenal, aku counselor RevoU utk program *AI-Enabled Strategic Finance - RevoU x Universitas Indonesia* 🙏 Makasih banyak yaa udh tertarik dgn programnya!\n\nIni program 13 minggu buat profesional finance & akuntansi yg mau naik ke peran lebih strategis, kayak Finance Manager, Head of FP&A, Financial Controller, sampai Head of Finance, dengan AI yg udah nyatu di cara kerjanya.\n\nBiar aku bisa bantu konsultasi yg pas, boleh tau dulu Kakak udh kerja di finance/accounting udh berapa lama kak? 😊',
    openingLead:
      'Ehiya halo kak, aku skrg kerja sebagai account payable. Kantorku bidangnya retail. Ini belajar AI aja atau gmn ya kak?',
    questions: [
      {
        seq: 1,
        type: 'question' as const,
        text: 'Aku sambil kerja full time kak. Kadang klo closing sampe malem nih.. Ini jadwalnya gimana ya padet bgt ga?',
      },
      {
        seq: 2,
        type: 'question' as const,
        text: 'Emang nanti AI-nya akan kyk gimana atau bikin apa ya kak?',
      },
      {
        seq: 3,
        type: 'question' as const,
        text: 'Pengajarnya siapa aja kak?',
      },
      {
        seq: 4,
        type: 'objection' as const,
        text: 'Jujur ya aku agak kaget lihat harganya di website. Ini aku pertimbangkan dulu ya kak',
      },
      {
        seq: 5,
        type: 'objection' as const,
        text: 'Kalau aku ada hari di mana gabisa hadir di kelas, gmn ya kak?',
      },
    ],
    bookingRequest:
      'Oke deh kak, lumayan kebayang sekarang. Aku mau ikut sesi konsultasi sama Counselor-nya dulu. Kapan bisa dijadwalkan ya kak?',
    bookingConfirm:
      'Siap kak, aku tunggu ya. Makasih infonya kak! 😊',
    timeLimitSec: 1200,
  },
];
