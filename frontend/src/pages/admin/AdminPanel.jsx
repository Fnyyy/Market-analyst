import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Users, Search, LogOut, TrendingUp, ToggleLeft, ToggleRight,
    Trash2, KeyRound, X, CheckCircle, AlertTriangle, RefreshCw,
    UserCheck, UserX, Clock, Crown, Eye, EyeOff, BookOpen, Plus, Edit,
    Upload, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store';

// ─── Research Modal ──────────────────────────────────────────────────────────
function ResearchModal({ report, onClose, onSave }) {
    const [form, setForm] = useState({
        ticker: report?.ticker || '',
        title: report?.title || '',
        currentPrice: report?.metrics?.currentPrice || 'Rp 1,250',
        targetPrice: report?.metrics?.targetPrice || 'Rp 1,500',
        rating: report?.metrics?.rating || 'BUY',
        riskLevel: report?.metrics?.riskLevel || 'Medium',
        analystName: report?.analyst?.name || '',
        tags: report?.tags?.join(', ') || '',
        body: report?.contentSections?.[0]?.body || '',
        pdfUrl: report?.pdfUrl || ''
    });

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState(report?.pdfUrl ? 'Existing PDF Report attached' : '');

    const handleFile = (file) => {
        if (file && file.type === 'application/pdf') {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(f => ({ ...f, pdfUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        } else if (file) {
            alert('Please upload a valid PDF file.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Calculate estimated upside
        const rawCurr = parseFloat(form.currentPrice.replace(/[^0-9.]/g, '')) || 0;
        const rawTarget = parseFloat(form.targetPrice.replace(/[^0-9.]/g, '')) || 0;
        let upside = '0.0%';
        if (rawCurr > 0) {
            const diff = ((rawTarget - rawCurr) / rawCurr) * 100;
            upside = (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
        }

        const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
        const avatar = form.analystName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

        const newReport = {
            ticker: form.ticker,
            title: form.title,
            date: report?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
            readingTime: report?.readingTime || '5 min read',
            analyst: {
                name: form.analystName,
                role: 'Equity Research Analyst',
                avatar: avatar || 'AN',
                color: report?.analyst?.color || 'bg-gradient-to-br from-indigo-500 to-purple-600'
            },
            metrics: {
                rating: form.rating,
                targetPrice: form.targetPrice.startsWith('Rp') ? form.targetPrice : `Rp ${form.targetPrice}`,
                currentPrice: form.currentPrice.startsWith('Rp') ? form.currentPrice : `Rp ${form.currentPrice}`,
                upside: upside,
                riskLevel: form.riskLevel,
                rawCurrentPrice: rawCurr,
                rawTargetPrice: rawTarget
            },
            tags: tagsArray,
            sourceData: report?.sourceData || [" Laporan Keuangan & Keterbukaan Informasi"],
            contentSections: [
                {
                    id: "overview",
                    title: "Executive Overview",
                    body: form.body
                }
            ],
            pdfUrl: form.pdfUrl
        };

        onSave(newReport);
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <motion.div className="admin-modal" style={{ maxWidth: '600px', width: '90%' }}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} onClick={e => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <BookOpen size={20} className="text-indigo-600" />
                    <h3>{report ? 'Edit Research Report' : 'Create Research Report'}</h3>
                    <button onClick={onClose}><X size={18}/></button>
                </div>
                <form onSubmit={handleSubmit} className="admin-modal-form" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="input-group">
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Ticker (e.g. BBCA.JK)</label>
                            <input type="text" name="ticker" value={form.ticker} onChange={handleChange} required placeholder="BBCA.JK" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm" />
                        </div>
                        <div className="input-group">
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Analyst Name</label>
                            <input type="text" name="analystName" value={form.analystName} onChange={handleChange} required placeholder="Budi Santoso" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm" />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Report Title</label>
                        <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="Ciputra Group (CTRA) - Strong Pre-sales and Solid Financials" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="input-group">
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Current Price (nominal)</label>
                            <input type="text" name="currentPrice" value={form.currentPrice} onChange={handleChange} required placeholder="1250" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm" />
                        </div>
                        <div className="input-group">
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Target Price (nominal)</label>
                            <input type="text" name="targetPrice" value={form.targetPrice} onChange={handleChange} required placeholder="1500" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="input-group">
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Recommendation</label>
                            <select name="rating" value={form.rating} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm">
                                <option value="BUY">BUY</option>
                                <option value="HOLD">HOLD</option>
                                <option value="SELL">SELL</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Risk Level</label>
                            <select name="riskLevel" value={form.riskLevel} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Tags (comma separated)</label>
                        <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="Real Estate, Pre-Sales, Value" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm" />
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Upload PDF Report (Optional)</label>
                        <div 
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
                            className={`w-full border-2 border-dashed rounded-xl p-6 text-center transition-all relative ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
                        >
                            <input 
                                type="file" 
                                accept="application/pdf" 
                                onChange={(e) => handleFile(e.target.files[0])} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                title="Upload PDF"
                            />
                            <div className="flex flex-col items-center gap-2 pointer-events-none">
                                {fileName ? (
                                    <FileText size={32} className="text-indigo-600" />
                                ) : (
                                    <Upload size={32} className={isDragging ? 'text-indigo-600' : 'text-slate-400'} />
                                )}
                                <p className="text-sm font-semibold text-slate-700">
                                    {fileName ? fileName : 'Click or drag PDF here to upload'}
                                </p>
                                {!fileName && <p className="text-xs text-slate-500">Max size 5MB</p>}
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Summary / Content (Plain Text)</label>
                        <textarea name="body" value={form.body} onChange={handleChange} required placeholder="Laporan analisis detail (tanpa format khusus)..." rows={6} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm" style={{ resize: 'vertical' }} />
                    </div>

                    <div className="admin-modal-actions">
                        <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="admin-btn admin-btn--primary">Save Report</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// ─── Reset Password Modal ─────────────────────────────────────────────────────
function ResetPasswordModal({ user, onClose, onReset }) {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) { setError("Passwords don't match"); return; }
        if (password.length < 6) { setError("Min 6 characters"); return; }
        setLoading(true);
        try {
            await onReset(user.id, password);
            onClose();
        } catch {
            setError('Failed to reset password');
        } finally { setLoading(false); }
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <motion.div className="admin-modal"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} onClick={e => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <KeyRound size={20} />
                    <h3>Reset Password for <span>{user.username}</span></h3>
                    <button onClick={onClose}><X size={18} /></button>
                </div>
                {error && <div className="admin-alert admin-alert--error">{error}</div>}
                <form onSubmit={handleSubmit} className="admin-modal-form">
                    <div className="input-group">
                        <label>New Password</label>
                        <div className="input-wrapper">
                            <KeyRound className="input-icon" size={15} />
                            <input type={showPass ? 'text' : 'password'} value={password}
                                onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
                            <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <div className="input-wrapper">
                            <KeyRound className="input-icon" size={15} />
                            <input type={showPass ? 'text' : 'password'} value={confirm}
                                onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" required />
                        </div>
                    </div>
                    <div className="admin-modal-actions">
                        <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
                            {loading ? <div className="login-spinner"></div> : <><KeyRound size={15} /> Reset</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ user, onClose, onConfirm }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try { await onConfirm(user.id); onClose(); }
        catch { setLoading(false); }
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <motion.div className="admin-modal admin-modal--sm"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} onClick={e => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <AlertTriangle size={20} className="text-red-500" />
                    <h3>Delete User</h3>
                    <button onClick={onClose}><X size={18} /></button>
                </div>
                <div className="admin-delete-body">
                    <p>Are you sure you want to delete <strong>{user.username}</strong>?</p>
                    <p className="admin-delete-warn">This action cannot be undone. All user data will be permanently removed.</p>
                </div>
                <div className="admin-modal-actions">
                    <button className="admin-btn admin-btn--ghost" onClick={onClose}>Cancel</button>
                    <button className="admin-btn admin-btn--danger" onClick={handleConfirm} disabled={loading}>
                        {loading ? <div className="login-spinner"></div> : <><Trash2 size={15} /> Delete</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, type, onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 3000);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <motion.div className={`admin-toast admin-toast--${type}`}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}>
            <CheckCircle size={16} /> {message}
        </motion.div>
    );
}

// ─── Admin Research Management Tab ───────────────────────────────────────────
function AdminResearchTab({ showToast }) {
    const { researchList, addResearch, updateResearch, deleteResearch } = useStore();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleSave = (report) => {
        if (editingReport) {
            updateResearch(editingReport.id, report);
            showToast('Research report updated successfully');
        } else {
            addResearch(report);
            showToast('Research report created successfully');
        }
        setEditingReport(null);
        setModalOpen(false);
    };

    const handleDelete = () => {
        if (deleteConfirm) {
            deleteResearch(deleteConfirm.id);
            showToast('Research report deleted successfully');
            setDeleteConfirm(null);
        }
    };

    const filtered = researchList.filter(r => 
        r.ticker.toLowerCase().includes(search.toLowerCase()) ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.analyst.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            <div className="admin-topbar">
                <div>
                    <h1 className="admin-page-title">Research Management</h1>
                    <p className="admin-page-subtitle">Publish and manage equity research reports</p>
                </div>
                <button className="admin-btn admin-btn--primary" onClick={() => { setEditingReport(null); setModalOpen(true); }}>
                    <Plus size={16} /> New Report
                </button>
            </div>

            {/* Toolbar */}
            <div className="admin-toolbar">
                <div className="admin-search" style={{ flex: 1 }}>
                    <Search size={16} className="admin-search-icon" />
                    <input type="text" placeholder="Search reports..." value={search}
                        onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            {/* Table */}
            <div className="admin-table-wrap">
                {filtered.length === 0 ? (
                    <div className="admin-empty">
                        <BookOpen size={40} />
                        <p>No research reports found</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Report</th>
                                <th>Ticker</th>
                                <th>Rating</th>
                                <th>Target Price</th>
                                <th>Analyst</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filtered.map((r, i) => (
                                    <motion.tr key={r.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="admin-table-row">
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{r.title}</div>
                                        </td>
                                        <td>
                                            <span className="admin-badge admin-badge--user">{r.ticker}</span>
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${r.metrics.rating === 'BUY' ? 'admin-badge--active' : r.metrics.rating === 'HOLD' ? 'admin-badge--admin' : 'admin-badge--inactive'}`}>
                                                {r.metrics.rating}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{r.metrics.targetPrice}</td>
                                        <td>{r.analyst.name}</td>
                                        <td>{r.date}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="admin-action-btn admin-action-btn--blue"
                                                    onClick={() => { setEditingReport(r); setModalOpen(true); }} title="Edit Report">
                                                    <Edit size={14} /> Edit
                                                </button>
                                                <button className="admin-action-btn admin-action-btn--danger"
                                                    onClick={() => setDeleteConfirm(r)} title="Delete Report">
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <ResearchModal report={editingReport} onClose={() => { setModalOpen(false); setEditingReport(null); }} onSave={handleSave} />
                )}
                {deleteConfirm && (
                    <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                        <motion.div className="admin-modal admin-modal--sm"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }} onClick={e => e.stopPropagation()}>
                            <div className="admin-modal-header">
                                <AlertTriangle size={20} className="text-red-500" />
                                <h3>Delete Report</h3>
                                <button onClick={() => setDeleteConfirm(null)}><X size={18} /></button>
                            </div>
                            <div className="admin-delete-body">
                                <p>Are you sure you want to delete this report for <strong>{deleteConfirm.ticker}</strong>?</p>
                                <p className="admin-delete-warn">This will remove the report from the public list.</p>
                            </div>
                            <div className="admin-modal-actions">
                                <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                                <button className="admin-btn admin-btn--danger" onClick={handleDelete}>
                                    <Trash2 size={15} /> Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
function AdminPanel() {
    const navigate = useNavigate();
    const { currentUser, adminUsers, fetchAdminUsers, adminToggleUser, adminResetPassword, adminDeleteUser, logout } = useStore();

    const [activeTab, setActiveTab] = useState('users'); // users | research
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all | active | inactive | admin
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [resetModal, setResetModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try { await fetchAdminUsers(); }
        catch { showToast('Failed to load users', 'error'); }
        finally { setLoading(false); }
    };

    const showToast = (message, type = 'success') => setToast({ message, type });

    const handleToggle = async (user) => {
        setActionLoading(`toggle-${user.id}`);
        try {
            await adminToggleUser(user.id);
            showToast(`${user.username} is now ${user.is_active ? 'inactive' : 'active'}`);
        } catch { showToast('Action failed', 'error'); }
        finally { setActionLoading(null); }
    };

    const handleResetPw = async (userId, newPassword) => {
        await adminResetPassword(userId, newPassword);
        showToast('Password reset successfully');
    };

    const handleDelete = async (userId) => {
        await adminDeleteUser(userId);
        showToast('User deleted successfully');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filtered = adminUsers.filter(u => {
        const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) ||
            (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            filter === 'all' ? true :
                filter === 'active' ? u.is_active :
                    filter === 'inactive' ? !u.is_active :
                        filter === 'admin' ? u.is_admin : true;
        return matchSearch && matchFilter;
    });

    const stats = {
        total: adminUsers.length,
        active: adminUsers.filter(u => u.is_active).length,
        inactive: adminUsers.filter(u => !u.is_active).length,
        admins: adminUsers.filter(u => u.is_admin).length,
    };

    const formatDate = (dt) => {
        if (!dt) return '—';
        return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="admin-page">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="admin-sidebar-brand">
                    <div className="admin-brand-icon"><TrendingUp size={22} /></div>
                    <div>
                        <div className="admin-brand-name">Sisvest</div>
                        <div className="admin-brand-sub">Admin Panel</div>
                    </div>
                </div>

                <div className="admin-sidebar-profile">
                    <div className="admin-avatar">
                        <Crown size={18} />
                    </div>
                    <div>
                        <div className="admin-profile-name">{currentUser?.username}</div>
                        <div className="admin-profile-role">Administrator</div>
                    </div>
                </div>

                <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                        <Users size={18} /> User Management
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'research' ? 'active' : ''}`}
                        onClick={() => setActiveTab('research')}
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                        <BookOpen size={18} /> Research Management
                    </button>
                </nav>

                <button className="admin-logout-btn" onClick={handleLogout}>
                    <LogOut size={16} /> Sign Out
                </button>
            </div>

            {/* Main Content */}
            <div className="admin-main">
                {activeTab === 'users' ? (
                    <>
                        {/* Top bar */}
                        <div className="admin-topbar">
                            <div>
                                <h1 className="admin-page-title">User Management</h1>
                                <p className="admin-page-subtitle">Monitor and manage all platform users</p>
                            </div>
                            <button className="admin-refresh-btn" onClick={loadUsers} disabled={loading}>
                                <RefreshCw size={16} className={loading ? 'spinning' : ''} /> Refresh
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="admin-stats">
                            {[
                                { label: 'Total Users', value: stats.total, icon: Users, color: 'blue' },
                                { label: 'Active', value: stats.active, icon: UserCheck, color: 'green' },
                                { label: 'Inactive', value: stats.inactive, icon: UserX, color: 'red' },
                                { label: 'Admins', value: stats.admins, icon: Shield, color: 'purple' },
                            ].map((s, i) => (
                                <motion.div key={s.label} className={`admin-stat-card admin-stat-card--${s.color}`}
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}>
                                    <div className="admin-stat-icon"><s.icon size={20} /></div>
                                    <div>
                                        <div className="admin-stat-value">{s.value}</div>
                                        <div className="admin-stat-label">{s.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Filters */}
                        <div className="admin-toolbar">
                            <div className="admin-search">
                                <Search size={16} className="admin-search-icon" />
                                <input type="text" placeholder="Search users..." value={search}
                                    onChange={e => setSearch(e.target.value)} />
                            </div>
                            <div className="admin-filters">
                                {['all', 'active', 'inactive', 'admin'].map(f => (
                                    <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
                                        onClick={() => setFilter(f)}>
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="admin-table-wrap">
                            {loading ? (
                                <div className="admin-loading">
                                    <RefreshCw size={24} className="spinning" />
                                    <span>Loading users...</span>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="admin-empty">
                                    <Users size={40} />
                                    <p>No users found</p>
                                </div>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Last Login</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {filtered.map((u, i) => (
                                                <motion.tr key={u.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ delay: i * 0.04 }}
                                                    className={`admin-table-row ${!u.is_active ? 'inactive' : ''}`}>
                                                    <td>
                                                        <div className="admin-user-cell">
                                                            <div className={`admin-user-avatar ${u.is_admin ? 'admin-user-avatar--admin' : ''}`}>
                                                                {u.is_admin ? <Crown size={14} /> : u.username[0].toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="admin-user-name">{u.username}</div>
                                                                {u.full_name && <div className="admin-user-fullname">{u.full_name}</div>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="admin-email">{u.email || '—'}</td>
                                                    <td>
                                                        {u.is_admin
                                                            ? <span className="admin-badge admin-badge--admin"><Shield size={11} /> Admin</span>
                                                            : <span className="admin-badge admin-badge--user"><Users size={11} /> User</span>}
                                                    </td>
                                                    <td>
                                                        {u.is_active
                                                            ? <span className="admin-badge admin-badge--active"><CheckCircle size={11} /> Active</span>
                                                            : <span className="admin-badge admin-badge--inactive"><X size={11} /> Inactive</span>}
                                                    </td>
                                                    <td className="admin-date">
                                                        <Clock size={13} /> {formatDate(u.last_login)}
                                                    </td>
                                                    <td>
                                                        <div className="admin-actions">
                                                            <button
                                                                className={`admin-action-btn ${u.is_active ? 'admin-action-btn--warn' : 'admin-action-btn--success'}`}
                                                                onClick={() => handleToggle(u)}
                                                                disabled={actionLoading === `toggle-${u.id}` || u.id === currentUser?.user_id}
                                                                title={u.is_active ? 'Deactivate' : 'Activate'}>
                                                                {u.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                                                {u.is_active ? 'Deactivate' : 'Activate'}
                                                            </button>
                                                            <button className="admin-action-btn admin-action-btn--blue"
                                                                onClick={() => setResetModal(u)} title="Reset Password">
                                                                <KeyRound size={14} /> Reset PW
                                                            </button>
                                                            {u.id !== currentUser?.user_id && !u.is_admin && (
                                                                <button className="admin-action-btn admin-action-btn--danger"
                                                                    onClick={() => setDeleteModal(u)} title="Delete User">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                ) : (
                    <AdminResearchTab showToast={showToast} />
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {resetModal && (
                    <ResetPasswordModal user={resetModal}
                        onClose={() => setResetModal(null)}
                        onReset={handleResetPw} />
                )}
                {deleteModal && (
                    <DeleteModal user={deleteModal}
                        onClose={() => setDeleteModal(null)}
                        onConfirm={handleDelete} />
                )}
                {toast && (
                    <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}

export default AdminPanel;
