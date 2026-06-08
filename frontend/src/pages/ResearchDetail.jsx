import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useStore from '../store';
import { Bookmark, Clock, Heart, Info, ArrowLeft, Edit3, Trash2, Plus, ChevronRight, TrendingUp, AlertTriangle, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ResearchDetail.css';

function ResearchDetail() {
    const { id } = useParams();
    const { researchList, notes, fetchNotes, addNote, updateNote, removeNote } = useStore();
    
    const listToUse = researchList && researchList.length > 0 ? researchList : [
        {
            id: 1,
            ticker: "CTRA.JK",
            title: "Ciputra Group (CTRA) - Strong Pre-sales and Solid Financials",
            date: "SEP 23, 2025",
            readingTime: "5 min read",
            analyst: { name: "Budi Santoso", role: "Senior Equity Analyst, Real Estate", avatar: "BS", color: "bg-gradient-to-br from-indigo-500 to-purple-600" },
            metrics: { rating: "BUY", targetPrice: "Rp 1,500", currentPrice: "Rp 1,250", upside: "+20.0%", riskLevel: "Medium", rawCurrentPrice: 1250, rawTargetPrice: 1500 },
            tags: ["Real Estate", "Pre-Sales", "Value"],
            sourceData: [" Laporan Keuangan & Keterbukaan Informasi", " Bank Indonesia: Data Suku Bunga", " Yahoo Finance: Historis Harga"],
            contentSections: [
                {
                    id: "overview", title: "Executive Overview",
                    body: `<p class="text-lg leading-relaxed text-slate-700 mb-6"><strong>Ciputra Development Tbk (CTRA)</strong> has demonstrated strong financial performance in early 2025, driven by robust pre-sales in key residential projects across major cities.</p>`
                }
            ]
        }
    ];

    const report = listToUse.find(r => r.id === parseInt(id, 10)) || listToUse.find(r => r.id === Number(id)) || listToUse[0];
    const [noteContent, setNoteContent] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        fetchNotes();
        window.scrollTo(0, 0);
    }, []);

    const activeNotes = notes.filter(n => n.ticker === report.ticker);

    const handleSaveNote = () => {
        if (!noteContent.trim()) return;
        if (editingNoteId) {
            updateNote(editingNoteId, { ticker: report.ticker, content: noteContent });
            setEditingNoteId(null);
        } else {
            addNote({ ticker: report.ticker, content: noteContent });
        }
        setNoteContent("");
    };

    const handleEditNote = (note) => {
        setEditingNoteId(note.id);
        setNoteContent(note.content);
        // Scroll to editor
        document.getElementById('note-editor').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
            {/* Elegant Header Background */}
            <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-slate-200/50 to-slate-50 pointer-events-none -z-10" />
            
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 flex flex-col xl:flex-row gap-10"
            >
                {/* Main Content Column */}
                <div className="flex-1 w-full max-w-4xl mx-auto xl:mx-0">
                    <motion.div variants={itemVariants}>
                        <Link to="/research" className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-8 bg-white/50 px-4 py-2 rounded-full border border-slate-200/60 shadow-sm backdrop-blur-sm">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                            Back to Research Hub
                        </Link>
                    </motion.div>

                    <motion.article variants={itemVariants} className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden mb-10">
                        {/* Decorative blob */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
                        
                        <header className="relative z-10 mb-12">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="bg-indigo-50 text-indigo-700 font-bold px-4 py-1.5 rounded-full text-sm border border-indigo-100/50 tracking-wide">
                                    {report.ticker}
                                </span>
                                {report.tags.map(tag => (
                                    <span key={tag} className="bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full text-sm font-medium border border-slate-200/50">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-[1.15] tracking-tight">
                                {report.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-full ${report.analyst.color} text-white flex items-center justify-center font-bold text-xl shadow-md ring-4 ring-white`}>
                                        {report.analyst.avatar}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-lg">{report.analyst.name}</p>
                                        <p className="text-sm text-slate-500 font-medium">{report.analyst.role}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block w-px h-10 bg-slate-200 mx-2"></div>
                                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                                    <div className="flex items-center gap-1.5"><Clock size={16} /> {report.readingTime}</div>
                                    <div className="flex items-center gap-1.5"><Bookmark size={16} /> {report.date}</div>
                                </div>
                            </div>
                        </header>

                        {report.pdfUrl && (
                            <div className="mb-10 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4 text-indigo-900">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <FileText size={24} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Full Report PDF</h3>
                                        <p className="text-sm text-indigo-700/80">Download or view the complete research document.</p>
                                    </div>
                                </div>
                                <a href={report.pdfUrl} download={`${report.ticker}_Research_Report.pdf`} className="shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-sm shadow-indigo-200">
                                    <ExternalLink size={18} />
                                    Download Document
                                </a>
                            </div>
                        )}

                        <div className="prose prose-lg prose-slate max-w-none relative z-10">
                            {report.contentSections.map(section => (
                                <section key={section.id} id={section.id} className="mb-12">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                            <ChevronRight size={20} strokeWidth={3} />
                                        </div>
                                        {section.title}
                                    </h2>
                                    <div 
                                        className={/<\/?[a-z][\s\S]*>/i.test(section.body) ? "" : "whitespace-pre-wrap"} 
                                        dangerouslySetInnerHTML={{ __html: section.body }} 
                                    />
                                </section>
                            ))}
                        </div>
                    </motion.article>

                    {/* Notes Section */}
                    <motion.div variants={itemVariants} id="note-editor" className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/40 border border-slate-100">
                        <div className="flex items-center gap-3 mb-2 text-indigo-600">
                            <div className="p-2.5 bg-indigo-50 rounded-xl">
                                <Edit3 size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Investment Thesis & Notes</h2>
                        </div>
                        <p className="text-slate-500 mb-8 font-medium">Document your private research, hypotheses, and key takeaways for {report.ticker}.</p>
                        
                        <div className={`relative transition-all duration-300 rounded-2xl border-2 bg-slate-50/50 p-2 mb-10 ${isFocused ? 'border-indigo-400 shadow-[0_0_0_4px_rgba(129,140,248,0.2)] bg-white' : 'border-slate-200 hover:border-slate-300'}`}>
                            <textarea 
                                className="w-full min-h-[140px] bg-transparent border-none outline-none resize-y p-4 text-slate-700 text-lg placeholder:text-slate-400"
                                placeholder="E.g., Monitoring upcoming Q3 earnings. Strong pre-sales might lead to a beat on revenue..."
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                            <div className="flex justify-between items-center px-4 pb-2">
                                <span className="text-xs font-medium text-slate-400">Markdown supported</span>
                                <button 
                                    onClick={handleSaveNote} 
                                    disabled={!noteContent.trim()}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all transform active:scale-95"
                                >
                                    <Plus size={16} strokeWidth={3} /> {editingNoteId ? 'Update Note' : 'Save Note'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {activeNotes.length === 0 ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
                                            <Bookmark size={24} />
                                        </div>
                                        <p className="text-slate-500 font-medium">Your notebook is empty.</p>
                                        <p className="text-slate-400 text-sm mt-1">Jot down your first thought above.</p>
                                    </motion.div>
                                ) : (
                                    activeNotes.map(note => (
                                        <motion.div 
                                            key={note.id} 
                                            initial={{ opacity: 0, y: 10 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="p-6 bg-white border border-slate-200 rounded-2xl relative group hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                                        >
                                            <p className="text-slate-700 whitespace-pre-wrap text-lg leading-relaxed">{note.content}</p>
                                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                                                <Clock size={14} className="text-slate-400" />
                                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{new Date(note.updated_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</div>
                                            </div>
                                            
                                            <div className="absolute top-6 right-6 flex gap-2">
                                                <button onClick={() => handleEditNote(note)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors" title="Edit Note">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button onClick={() => removeNote(note.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors" title="Delete Note">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

                {/* Right Sidebar - Sticky Content */}
                <motion.aside variants={itemVariants} className="w-full xl:w-96 flex-shrink-0">
                    <div className="sticky top-24 space-y-6">
                        {/* Analyst Consensus Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                            {/* Decorative background for rating */}
                            <div className={`absolute top-0 left-0 w-full h-2 ${report.metrics.rating === 'BUY' ? 'bg-emerald-500' : report.metrics.rating === 'HOLD' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                            
                            <h3 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight flex items-center gap-2">
                                <TrendingUp className="text-indigo-500" size={24} /> Analyst Consensus
                            </h3>
                            
                            <div className="mb-8 text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Recommendation</p>
                                <div className={`inline-flex items-center justify-center px-6 py-2 rounded-full text-lg font-bold ${
                                    report.metrics.rating === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 
                                    report.metrics.rating === 'HOLD' ? 'bg-amber-100 text-amber-700' : 
                                    'bg-rose-100 text-rose-700'
                                }`}>
                                    {report.metrics.rating}
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">Target Price</p>
                                        <p className="text-xl font-bold text-slate-900">{report.metrics.targetPrice}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-500 mb-1">Current</p>
                                        <p className="text-lg font-semibold text-slate-600">{report.metrics.currentPrice}</p>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                    <span className="text-slate-500 font-medium">Est. Upside</span>
                                    <span className={`font-bold px-3 py-1 rounded-lg ${report.metrics.upside.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                        {report.metrics.upside}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                                        Risk Level
                                        <Info size={14} className="text-slate-400" />
                                    </span>
                                    <span className={`font-bold flex items-center gap-1.5 ${
                                        report.metrics.riskLevel === 'Low' ? 'text-emerald-500' : 
                                        report.metrics.riskLevel === 'Medium' ? 'text-amber-500' : 
                                        'text-rose-500'
                                    }`}>
                                        {report.metrics.riskLevel === 'High' && <AlertTriangle size={16} />}
                                        {report.metrics.riskLevel === 'Low' && <CheckCircle2 size={16} />}
                                        {report.metrics.riskLevel}
                                    </span>
                                </div>
                            </div>
                            
                            <button className="w-full mt-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors shadow-lg shadow-slate-900/20">
                                Trade {report.ticker.split('.')[0]}
                            </button>
                        </div>
                        
                        {/* Reference Documents */}
                        <div className="bg-white rounded-3xl p-6 shadow-md shadow-slate-200/30 border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Source Documents</h3>
                            <ul className="space-y-3">
                                {report.sourceData.map((source, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer group">
                                        <div className="mt-0.5 p-1 bg-slate-100 rounded group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            <Info size={14} />
                                        </div>
                                        <span className="leading-snug">{source}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.aside>
            </motion.div>
        </div>
    );
}

export default ResearchDetail;
