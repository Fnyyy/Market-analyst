import React from 'react';
import { PlayCircle, CheckCircle, BookOpen, Clock, Trophy, Flame, Star, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../../store';
import { getCompletedModules } from './CourseViewer';

const COURSES = [
    {
        id: 1,
        title: "Saham 101: Apa itu Saham?",
        description: "Pelajari dasar-dasar saham, bagaimana cara kerjanya, dan mengapa Anda harus berinvestasi untuk masa depan.",
        duration: "10 min",
        level: "Beginner",
        icon: "📈",
        color: "from-emerald-500 to-teal-600",
        lightColor: "bg-emerald-50",
        textColor: "text-emerald-600",
        borderColor: "border-emerald-200",
    },
    {
        id: 2,
        title: "Analisa Fundamental vs Teknikal",
        description: "Mengenal dua aliran utama dalam menganalisa saham. Kapan melihat laporan keuangan dan kapan melihat grafik.",
        duration: "15 min",
        level: "Beginner",
        icon: "🔍",
        color: "from-blue-500 to-indigo-600",
        lightColor: "bg-blue-50",
        textColor: "text-blue-600",
        borderColor: "border-blue-200",
    },
    {
        id: 3,
        title: "Membaca Grafik (Candlestick)",
        description: "Cara membaca grafik harga saham (Bullish & Bearish) agar mengetahui kapan waktu yang tepat untuk membeli dan menjual.",
        duration: "25 min",
        level: "Intermediate",
        icon: "📊",
        color: "from-violet-500 to-purple-600",
        lightColor: "bg-violet-50",
        textColor: "text-violet-600",
        borderColor: "border-violet-200",
    },
    {
        id: 4,
        title: "Psikologi Trading & Investasi",
        description: "Mengontrol emosi (FOMO & Panic Selling) saat pasar sedang jatuh atau naik drastis.",
        duration: "12 min",
        level: "Beginner",
        icon: "🧠",
        color: "from-rose-500 to-pink-600",
        lightColor: "bg-rose-50",
        textColor: "text-rose-600",
        borderColor: "border-rose-200",
    }
];

const levelColors = {
    Beginner: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
    Intermediate: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-400' },
    Advanced: { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-400' },
};

function Courses() {
    const navigate = useNavigate();
    const { currentUser } = useStore();
    const username = currentUser?.username || 'guest';

    // Read completed modules from localStorage (dynamic, not hardcoded)
    const completedModules = getCompletedModules(username);
    const completedCount = completedModules.length;
    const progressPct = Math.round((completedCount / COURSES.length) * 100);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 15 } }
    };

    return (
        <div className="min-h-full p-6 lg:p-10">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
            >
                {/* Top badge */}
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                    <Flame size={13} />
                    Learning Center
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
                            Kuasai Dunia<br />
                            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Investasi Saham</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium max-w-xl">
                            Bangun fondasi ilmu investasi Anda sebelum membangun portofolio yang menguntungkan.
                        </p>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-100 p-6 min-w-[220px] flex-shrink-0">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <Trophy size={16} className="text-amber-500" />
                                </div>
                                <span className="text-sm font-semibold text-slate-600">Progress</span>
                            </div>
                            <span className="text-2xl font-extrabold text-slate-900">{completedCount}<span className="text-slate-400 font-semibold text-lg"> / {COURSES.length}</span></span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-medium">{progressPct}% Completed</p>
                    </div>
                </div>
            </motion.div>

            {/* Courses Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {COURSES.map((course) => {
                    const isCompleted = completedModules.includes(course.id);
                    const lvlStyle = levelColors[course.level] || levelColors.Beginner;
                    return (
                        <motion.div
                            key={course.id}
                            variants={itemVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className={`group relative bg-white rounded-2xl border overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 ${isCompleted ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-100'}`}
                            onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                        >
                            {/* Top gradient bar */}
                            <div className={`h-1.5 w-full bg-gradient-to-r ${course.color}`} />

                            <div className="p-6">
                                {/* Card Header */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl ${course.lightColor} ${course.borderColor} border flex items-center justify-center text-2xl shadow-sm flex-shrink-0`}>
                                            {course.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${lvlStyle.bg} ${lvlStyle.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${lvlStyle.dot}`}></span>
                                                    {course.level}
                                                </span>
                                                {isCompleted && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                        <CheckCircle size={11} />
                                                        Selesai
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                                                <Clock size={12} />
                                                {course.duration}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                                        {isCompleted
                                            ? <CheckCircle size={18} />
                                            : <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                        }
                                    </div>
                                </div>

                                {/* Title & Description */}
                                <h3 className={`text-lg font-bold mb-2 leading-snug tracking-tight ${isCompleted ? 'text-slate-700' : 'text-slate-900'}`}>
                                    {course.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                    {course.description}
                                </p>

                                {/* Action Button */}
                                <button
                                    className={`w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm transition-all duration-200 ${
                                        isCompleted
                                            ? 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                            : `bg-gradient-to-r ${course.color} text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]`
                                    }`}
                                    onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/courses/${course.id}`); }}
                                >
                                    {isCompleted
                                        ? <><BookOpen size={15} /> Tinjau Materi</>
                                        : <><PlayCircle size={15} /> Mulai Belajar <ArrowRight size={13} /></>
                                    }
                                </button>
                            </div>

                            {/* Completed overlay accent */}
                            {isCompleted && (
                                <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Star size={14} className="text-white fill-white" />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Bottom Motivational Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white relative overflow-hidden"
            >
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-indigo-200 text-sm font-semibold mb-1 uppercase tracking-wider">Investasi Terbaik</p>
                        <h3 className="text-2xl font-extrabold">Investasikan pada dirimu sendiri.</h3>
                        <p className="text-indigo-200 mt-1 text-sm">Pengetahuan yang Anda bangun hari ini adalah keuntungan masa depan Anda.</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-center">
                            <div className="text-3xl font-extrabold">{completedCount}</div>
                            <div className="text-xs text-indigo-200 font-medium">Selesai</div>
                        </div>
                        <div className="w-px h-12 bg-white/20" />
                        <div className="text-center">
                            <div className="text-3xl font-extrabold">{COURSES.length - completedCount}</div>
                            <div className="text-xs text-indigo-200 font-medium">Tersisa</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Courses;
