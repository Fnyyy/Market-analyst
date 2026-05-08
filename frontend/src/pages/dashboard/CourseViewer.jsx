import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, PlayCircle, BookOpen, ChevronRight, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store';

// ─── Course Content Data ────────────────────────────────────────────────────
const COURSE_CONTENT = {
    1: {
        title: "Saham 101: Apa itu Saham?",
        duration: "10 min read",
        level: "Beginner",
        icon: "📈",
        color: "from-emerald-500 to-teal-600",
        nextId: 2,
        nextTitle: "Analisa Fundamental vs Teknikal",
        content: `
## Pengantar Singkat
Saham sering kali dianggap sebagai sesuatu yang rumit, penuh dengan grafik membingungkan dan layar yang bergerak cepat. Padahal, **saham pada dasarnya sangat sederhana**. 

Saham adalah bukti kepemilikan Anda terhadap sebuah perusahaan riil yang berjalan. Saat Anda membeli saham "PT Bank Central Asia Tbk" (BBCA), Anda secara harfiah membeli sebagian kecil dari bank nyata tersebut. Anda menjadi salah satu "Bos" kecil dari perusahaan itu!

---

## Mengapa Perusahaan Menjual Sahamnya?
Bayangkan Anda memiliki sebuah warung kopi yang sangat laris. Anda ingin membuka 10 cabang baru di kota lain, tetapi Anda kekurangan dana bermiliar-miliar rupiah.

Apa yang Anda lakukan? 
Daripada meminjam ke bank yang bunganya besar, Anda memutuskan untuk **menjual sebagian persen kepemilikan warung kopi Anda** kepada puluhan ribu orang lain (investor). Uang patungan dari ribuan orang itu Anda gunakan untuk ekspansi 10 cabang baru. Inilah yang dilakukan perusahaan saat mereka merilis saham ke publik, sebuah proses yang disebut **IPO (Initial Public Offering)**.

---

## Kenapa Anda Harus Berinvestasi Saham?
Ada 2 alasan utama mengapa orang mau repot-repot membeli kepemilikan perusahaan:

### 1. Capital Gain (Keuntungan Harga)
Apabila warung kopi Anda tadi berhasil buka 10 cabang dan makin untung, harga warung kopi Anda akan meroket! Saham yang tadinya Anda beli seharga Rp1.000 per lembar, kini bisa dengan mudah ditawar oleh orang lain seharga Rp2.000 atau Rp5.000 per lembar. Saat Anda jual, Anda mendapat selisih untungnya.

### 2. Dividen (Bagi Hasil)
Sebagai salah satu pemilik, walau hanya 0.00001%, Anda berhak mendapatkan porsi bagi hasil dari keuntungan riil (laba bersih) perusahaan setiap tahunnya. Uang ini akan ditransfer langsung (cash) ke rekening dana Anda. Inilah yang disebut dengan Dividen.

---

## Risiko Dasar
Jika perusahaannya berhasil, harga saham naik. Sebaliknya, **jika perusahaan bangkrut atau terus merugi, harga sahamnya juga akan ikut hancur**. Inilah sebabnya kita harus menganalisa perusahaan sebelum membeli sahamnya, bukan asal tebak-tebak buah manggis.

Di modul selanjutnya (Fundamental Analisis), Anda akan belajar cara menilai apakah sebuah perusahaan itu "Sehat" atau "Sakit".
        `
    },
    2: {
        title: "Analisa Fundamental vs Teknikal",
        duration: "15 min read",
        level: "Beginner",
        icon: "🔍",
        color: "from-blue-500 to-indigo-600",
        nextId: 3,
        nextTitle: "Membaca Grafik (Candlestick)",
        content: `
## Dua Aliran Besar di Pasar Modal
Dalam menganalisa saham mana yang harus dibeli, investor biasanya terbagi menjadi dua kelompok besar: **Fundamentalist** dan **Chartist/Teknikal**. Keduanya memiliki fungsi dan tujuan yang berbeda.

---

## 1. Analisa Fundamental
Analisa **Fundamental** berfokus pada **kinerja nyata** dari suatu perusahaan. Analisa ini menjawab pertanyaan: *"Apakah perusahaan ini sehat dan menghasilkan untung?"*

Yang dinilai dalam analisa fundamental:
- **Laporan Keuangan**: Laba bersih, total utang, kas yang dimiliki.
- **Model Bisnis**: Apakah produk yang mereka jual laku di masa depan?
- **Manajemen**: Siapa direkturnya? Apakah mereka jujur dan kompeten?

Analisa ini sangat cocok bagi **Investor Jangka Panjang** yang berniat memegang saham selama berbulan-bulan hingga puluhan tahun untuk mendapat Dividen dan Capital Gain perlahan namun pasti.

---

## 2. Analisa Teknikal
Analisa **Teknikal** mengabaikan laporan keuangan dan murni berfokus pada **grafik pergerakan harga historis**. Analisa ini menjawab pertanyaan: *"Kapan waktu terbaik untuk membeli (Timing)?"*

Yang dinilai dalam analisa teknikal:
- **Trend Harga**: Apakah grafik sedang menanjak (Uptrend) atau menurun (Downtrend).
- **Support & Resistance**: Titik harga pantulan terbawah (support) dan puncak tertinggi (resistance).
- **Volume Perdagangan**: Seberapa banyak orang yang sedang berebut membeli atau menjual saham ini hari ini.

Analisa ini sangat cocok bagi **Trader** yang mencari keuntungan harian, mingguan, atau dalam tempo cepat murni dari fluktuasi harga sesaat.

---

## Kesimpulan: Mana yang lebih baik?
Keduanya penting! Gabungan terbaik adalah: Gunakan **Analisa Fundamental** untuk mencari "Saham Apa" yang layak dibeli, dan gunakan **Analisa Teknikal** untuk mencari "Kapan Waktu" yang pas membelinya.
        `
    },
    3: {
        title: "Membaca Grafik (Candlestick)",
        duration: "25 min read",
        level: "Intermediate",
        icon: "📊",
        color: "from-violet-500 to-purple-600",
        nextId: 4,
        nextTitle: "Psikologi Trading & Investasi",
        content: `
## Mengenal Candlestick (Lilin Jepang)
Saat Anda melihat grafik saham di Dashboard Sisvest, Anda akan melihat grafik naik dan turun. Trader profesional menggunakan tampilan yang disebut **Japanese Candlestick** (Lilin Jepang) karena memberikan lebih banyak informasi daripada sekadar garis biasa.

---

## Anatomi Candlestick
Setiap satu lilin (candle) mewakili rentang waktu tertentu (misal: per hari, per jam, atau per 5 menit). Ada dua tubuh lilin utama:

### 1. Lilin Hijau (Bullish / Naik)
Terjadi jika harga penutupan di akhir hari LEBIH TINGGI daripada harga saat pembukaan di pagi hari.
- **Bodi Lilin**: Meredam rentang kenaikan pasar.
- **Ekor Atas/Bawah**: Harga tertinggi dan terendah yang sempat tersentuh hari itu.

### 2. Lilin Merah (Bearish / Turun)
Terjadi jika harga di akhir hari jatuh menjadi LEBIH RENDAH daripada saat dibuka.

---

## Mengenal Pola (Pattern)
Terkadang, beberapa jejeran lilin candelstick membentuk *pola* yang dipercaya mengindikasikan kelanjutan arah harga. Beberapa pola populer:
- **Doji**: Lilit yang bentuk bodinya nyaris rata (seperti tanda plus). Artinya penjual dan pembeli sedang seimbang, kemungkinan arah harga akan berbalik.
- **Hammer (Palu)**: Lilin dengan ekor bawah panjang. Biasa menjadi tanda bahwa harga yang tadinya turun, sekarang mulai didorong naik tajam oleh orang yang berebut beli di harga bawah.

Di kelas lanjutan, Anda akan belajar lebih dari 20 motif Candlestick.
        `
    },
    4: {
        title: "Psikologi Trading & Investasi",
        duration: "12 min read",
        level: "Beginner",
        icon: "🧠",
        color: "from-rose-500 to-pink-600",
        nextId: null,
        nextTitle: null,
        content: `
## Musuh Terbesar Investor Adalah Dirinya Sendiri
Warren Buffett, pakar saham terbaik di dunia berkata: *"Pasar saham adalah alat untuk mentransfer kekayaan dari orang yang tidak sabaran, kepada orang yang sabar."*

Dalam investasi saham, memiliki kecerdasan dan rumus adalah nomor dua. Yang paling utama adalah **Pengendalian Emosi (Psikologi)**.

---

## 2 Setan di Pasar Modal: FOMO & Panic Selling

### 1. FOMO (Fear Of Missing Out)
Ini terjadi ketika Anda melihat suatu saham tiba-tiba **meroket hijau** karena sedang viral dibicarakan. Anda takut "ketinggalan kereta", sehingga Anda membelinya di **harga puncak tertinggi**. Keesokan harinya? Orang-orang yang sadar mulai menjual, harga anjlok, dan uang Anda ikut nyangkut di pucuk harga tertinggi.

**Solusi:** Jangan pernah membeli karena ikut-ikutan berita viral hari ini. Belilah karena Anda sudah menganalisanya jauh-jauh hari.

### 2. Panic Selling
Ini terjadi ketika sentimen global memburuk (misal: berita perang, krisis ekonomi global) dan menyebabkan pasar **merah berdarah serentak**. Secara refleks bertahan hidup, otak Anda menyuruh Anda "JUAL!" seluruh saham yang Anda punya sekalipun dengan harga diskon ekstrem rugi besar. Padahal, perusahaan yang sahamnya Anda pegang ternyata sehat-sehat saja dan bisnisnya masih berjalan normal.

**Solusi:** Berpegang teguh pada rencana investasi (Trading Plan). Jika memang Fundamental perusahaan masih sehat, krisis di luaran seringkali menjadi ajang "diskon murah" untuk membeli lebih banyak, bukan untuk menjualnya.
        `
    }
};

// ─── Helper: localStorage-based completion tracking per user ─────────────────
function getCompletedModules(username) {
    try {
        const data = JSON.parse(localStorage.getItem(`sisvest_completed_${username}`) || '[]');
        return Array.isArray(data) ? data : [];
    } catch { return []; }
}

function markModuleCompleted(username, moduleId) {
    const list = getCompletedModules(username);
    if (!list.includes(moduleId)) {
        list.push(moduleId);
        localStorage.setItem(`sisvest_completed_${username}`, JSON.stringify(list));
    }
}

// Expose for Courses.jsx to import
export { getCompletedModules };

// ─── Component ───────────────────────────────────────────────────────────────
function CourseViewer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useStore();
    const username = currentUser?.username || 'guest';

    const course = COURSE_CONTENT[id];
    const articleRef = useRef(null);
    const endSentinelRef = useRef(null);

    const [scrollProgress, setScrollProgress] = useState(0);
    const [hasReachedBottom, setHasReachedBottom] = useState(false);
    const [justCompleted, setJustCompleted] = useState(false);
    const isAlreadyCompleted = getCompletedModules(username).includes(Number(id));

    // Scroll to top when module changes
    useEffect(() => {
        window.scrollTo(0, 0);
        setScrollProgress(0);
        setHasReachedBottom(false);
        setJustCompleted(false);
    }, [id]);

    // Intersection Observer for end of article
    useEffect(() => {
        if (!endSentinelRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasReachedBottom) {
                    setHasReachedBottom(true);
                    if (!isAlreadyCompleted) {
                        markModuleCompleted(username, Number(id));
                        setJustCompleted(true);
                    }
                }
            },
            { threshold: 0.8 }
        );
        observer.observe(endSentinelRef.current);
        return () => observer.disconnect();
    }, [id, hasReachedBottom, isAlreadyCompleted, username]);

    // Scroll progress bar
    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            setScrollProgress(Math.min(1, scrollTop / docHeight));
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    if (!course) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Modul Tidak Ditemukan</h2>
                <p className="text-slate-500 mb-6">Modul yang Anda cari tidak ada dalam database kami.</p>
                <button className="glass-button" onClick={() => navigate('/dashboard/courses')}>
                    Kembali ke Learning Center
                </button>
            </div>
        );
    }

    // ─── Markdown renderer ────────────────────────────────────────────────────
    const renderMarkdownContent = (text) => {
        const html = text
            .replace(/\*([^*]+)\*/gim, '<em>$1</em>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*([^*]+)\*\*/gim, '<strong>$1</strong>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
            .replace(/^---/gim, '<hr />')
            .replace(/\n\n/gim, '</p><p>')
            .replace(/\n(?!<)/gim, '<br/>');
        return <div className="prose-content" dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }} />;
    };

    const levelBg = course.level === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
    const completed = isAlreadyCompleted || hasReachedBottom;
    const moduleNum = Number(id);

    return (
        <>
            {/* ─── Fixed Top Progress Bar ──────────────────────────────────── */}
            <div className="fixed top-[66px] left-0 right-0 z-50 h-1 bg-slate-100">
                <motion.div
                    className={`h-full bg-gradient-to-r ${course.color}`}
                    style={{ width: `${scrollProgress * 100}%` }}
                    transition={{ duration: 0.05 }}
                />
            </div>

            <div className="min-h-full">
                {/* ─── Header ──────────────────────────────────────────── */}
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-3xl mx-auto px-6 py-6">
                        <button
                            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-5 group"
                            onClick={() => navigate('/dashboard/courses')}
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Learning Center
                        </button>

                        <div className="flex items-start gap-5">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}>
                                {course.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${levelBg}`}>
                                        {course.level}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-medium">
                                        <Clock size={12} /> {course.duration}
                                    </span>
                                    <span className="text-slate-300 text-xs">•</span>
                                    <span className="text-slate-400 text-xs font-medium">Modul {moduleNum} dari 4</span>
                                    {completed && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                            <CheckCircle size={11} /> Selesai
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                    {course.title}
                                </h1>
                            </div>
                        </div>

                        {/* Reading progress indicator */}
                        <div className="mt-5 flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full bg-gradient-to-r ${course.color}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${scrollProgress * 100}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-slate-400 w-10 text-right">
                                {Math.round(scrollProgress * 100)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* ─── Article Content ──────────────────────────────────── */}
                <div className="max-w-3xl mx-auto px-6 py-10" ref={articleRef}>
                    <article className="course-article-content">
                        {renderMarkdownContent(course.content.trim())}
                    </article>

                    {/* ─── End Sentinel (triggers completion) ──────────── */}
                    <div ref={endSentinelRef} className="h-4" />

                    {/* ─── Completion Card ──────────────────────────────── */}
                    <AnimatePresence>
                        {completed && (
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 80, damping: 14 }}
                                className="mt-8 mb-12 relative"
                            >
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-500/20">
                                    {/* Decorations */}
                                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-lg" />

                                    <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
                                                {justCompleted ? <Sparkles size={28} /> : <Award size={28} />}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-extrabold mb-1">
                                                    {justCompleted ? '🎉 Selamat!' : '✅ Modul Selesai'}
                                                </h3>
                                                <p className="text-emerald-100 text-sm">
                                                    {justCompleted
                                                        ? `Anda telah menyelesaikan Modul ${moduleNum}! Progress Anda telah diperbarui.`
                                                        : `Anda sudah menyelesaikan modul ini sebelumnya.`
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 md:ml-auto flex-shrink-0">
                                            {course.nextId ? (
                                                <button
                                                    onClick={() => navigate(`/dashboard/courses/${course.nextId}`)}
                                                    className="flex items-center gap-2 px-5 py-3 bg-white text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
                                                >
                                                    Modul Berikutnya <ChevronRight size={16} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => navigate('/dashboard/courses')}
                                                    className="flex items-center gap-2 px-5 py-3 bg-white text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
                                                >
                                                    <Award size={16} /> Kembali ke Daftar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Not completed yet message */}
                    {!completed && (
                        <div className="mt-8 mb-12 bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
                            <div className="text-3xl mb-2">👇</div>
                            <p className="text-slate-500 text-sm font-medium">
                                Scroll sampai akhir untuk menyelesaikan modul ini
                            </p>
                            <div className="mt-3 flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CourseViewer;
