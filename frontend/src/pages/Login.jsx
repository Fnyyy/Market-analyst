import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Lock, LogIn, TrendingUp, ArrowRight, BarChart3,
    Shield, Zap, Mail, HelpCircle, Eye, EyeOff, UserPlus,
    X, ChevronRight, KeyRound, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store';

const SECURITY_QUESTIONS = [
    "What was the name of your first pet?",
    "What city were you born in?",
    "What is your mother's maiden name?",
    "What was the name of your elementary school?",
    "What is the name of your favorite childhood friend?",
];

// ─── Register Modal ──────────────────────────────────────────────────────────
function RegisterModal({ onClose, onSuccess }) {
    const { register } = useStore();
    const [form, setForm] = useState({
        username: '', password: '', confirmPassword: '',
        email: '', full_name: '', security_question: SECURITY_QUESTIONS[0], security_answer: ''
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (!form.security_answer.trim()) {
            setError('Security answer is required');
            return;
        }
        setLoading(true);
        try {
            const data = await register({
                username: form.username,
                password: form.password,
                email: form.email || undefined,
                full_name: form.full_name || undefined,
                security_question: form.security_question,
                security_answer: form.security_answer,
            });
            onSuccess(data);
        } catch (err) {
            setError(err?.response?.data?.detail || (err?.code === 'ERR_NETWORK' ? 'Cannot connect to server. Is the backend running?' : 'Registration failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div
                className="modal-box"
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 30 }}
                transition={{ duration: 0.25 }}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header">
                    <div className="modal-header-icon"><UserPlus size={22} /></div>
                    <div>
                        <h2>Create Account</h2>
                        <p>Fill in your details to get started</p>
                    </div>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="modal-row">
                        <div className="input-group">
                            <label>Username <span className="req">*</span></label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={16} />
                                <input name="username" type="text" placeholder="Choose username" value={form.username}
                                    onChange={handleChange} required autoComplete="off" />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={16} />
                                <input name="full_name" type="text" placeholder="Your full name" value={form.full_name}
                                    onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={16} />
                            <input name="email" type="email" placeholder="your@email.com" value={form.email}
                                onChange={handleChange} />
                        </div>
                    </div>

                    <div className="modal-row">
                        <div className="input-group">
                            <label>Password <span className="req">*</span></label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={16} />
                                <input name="password" type={showPass ? 'text' : 'password'} placeholder="Min 6 chars"
                                    value={form.password} onChange={handleChange} required />
                                <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Confirm Password <span className="req">*</span></label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={16} />
                                <input name="confirmPassword" type={showPass ? 'text' : 'password'} placeholder="Repeat password"
                                    value={form.confirmPassword} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Security Question <span className="req">*</span></label>
                        <div className="input-wrapper select-wrapper">
                            <HelpCircle className="input-icon" size={16} />
                            <select name="security_question" value={form.security_question} onChange={handleChange}>
                                {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Security Answer <span className="req">*</span></label>
                        <div className="input-wrapper">
                            <KeyRound className="input-icon" size={16} />
                            <input name="security_answer" type="text" placeholder="Your answer (case-insensitive)"
                                value={form.security_answer} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="modal-submit-btn" disabled={loading}>
                        {loading ? <div className="login-spinner"></div> : <><UserPlus size={17} /> Create Account</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

// ─── Forgot Password Modal ───────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }) {
    const { forgotGetQuestion, forgotVerifyAnswer, forgotResetPassword } = useStore();
    const [step, setStep] = useState(1); // 1=username, 2=answer, 3=new password, 4=done
    const [username, setUsername] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const step1 = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await forgotGetQuestion(username);
            setQuestion(data.security_question);
            setStep(2);
        } catch (err) {
            setError(err?.response?.data?.detail || 'User not found');
        } finally { setLoading(false); }
    };

    const step2 = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await forgotVerifyAnswer(username, answer);
            setStep(3);
        } catch (err) {
            setError(err?.response?.data?.detail || 'Incorrect answer');
        } finally { setLoading(false); }
    };

    const step3 = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
        if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            await forgotResetPassword(username, answer, newPassword);
            setStep(4);
        } catch (err) {
            setError(err?.response?.data?.detail || 'Failed to reset password');
        } finally { setLoading(false); }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div
                className="modal-box modal-box--sm"
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 30 }}
                transition={{ duration: 0.25 }}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header">
                    <div className="modal-header-icon"><KeyRound size={22} /></div>
                    <div>
                        <h2>Forgot Password</h2>
                        <p>Step {step} of 3</p>
                    </div>
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>
                </div>

                {/* Progress bar */}
                <div className="forgot-steps">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`forgot-step ${step >= s ? 'active' : ''} ${step > s ? 'done' : ''}`}>
                            <div className="step-dot">{step > s ? <CheckCircle size={14} /> : s}</div>
                            <span>{s === 1 ? 'Find User' : s === 2 ? 'Verify' : 'New Password'}</span>
                        </div>
                    ))}
                </div>

                {error && <div className="auth-error">{error}</div>}

                <div className="modal-form">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form key="s1" onSubmit={step1}
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="input-group">
                                    <label>Enter your username</label>
                                    <div className="input-wrapper">
                                        <User className="input-icon" size={16} />
                                        <input type="text" placeholder="Your username" value={username}
                                            onChange={e => setUsername(e.target.value)} required />
                                    </div>
                                </div>
                                <button type="submit" className="modal-submit-btn" disabled={loading}>
                                    {loading ? <div className="login-spinner"></div> : <><ChevronRight size={17} /> Continue</>}
                                </button>
                            </motion.form>
                        )}
                        {step === 2 && (
                            <motion.form key="s2" onSubmit={step2}
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="forgot-question-box">
                                    <HelpCircle size={18} />
                                    <p>{question}</p>
                                </div>
                                <div className="input-group">
                                    <label>Your Answer</label>
                                    <div className="input-wrapper">
                                        <KeyRound className="input-icon" size={16} />
                                        <input type="text" placeholder="Case-insensitive" value={answer}
                                            onChange={e => setAnswer(e.target.value)} required />
                                    </div>
                                </div>
                                <button type="submit" className="modal-submit-btn" disabled={loading}>
                                    {loading ? <div className="login-spinner"></div> : <><ChevronRight size={17} /> Verify Answer</>}
                                </button>
                            </motion.form>
                        )}
                        {step === 3 && (
                            <motion.form key="s3" onSubmit={step3}
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="input-group">
                                    <label>New Password</label>
                                    <div className="input-wrapper">
                                        <Lock className="input-icon" size={16} />
                                        <input type="password" placeholder="Min 6 characters" value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Confirm New Password</label>
                                    <div className="input-wrapper">
                                        <Lock className="input-icon" size={16} />
                                        <input type="password" placeholder="Repeat password" value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)} required />
                                    </div>
                                </div>
                                <button type="submit" className="modal-submit-btn" disabled={loading}>
                                    {loading ? <div className="login-spinner"></div> : <><KeyRound size={17} /> Reset Password</>}
                                </button>
                            </motion.form>
                        )}
                        {step === 4 && (
                            <motion.div key="s4" className="forgot-success"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                <CheckCircle size={48} className="success-icon" />
                                <h3>Password Reset!</h3>
                                <p>You can now log in with your new password.</p>
                                <button className="modal-submit-btn" onClick={onClose}>
                                    <LogIn size={17} /> Back to Login
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Main Login Page ─────────────────────────────────────────────────────────
function Login() {
    const navigate = useNavigate();
    const { login } = useStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [modal, setModal] = useState(null); // 'register' | 'forgot' | null

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const data = await login(username, password);
            if (data.is_admin) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err?.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: BarChart3, title: 'Real-time Analytics', desc: 'Live market data & AI-powered insights' },
        { icon: Shield, title: 'Paper Trading', desc: 'Practice without risking real money' },
        { icon: Zap, title: 'Smart Alerts', desc: 'AI-driven price target notifications' },
    ];

    return (
        <>
            <div className="login-page">
                {/* Left panel */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="login-brand-panel"
                >
                    <div className="login-brand-content">
                        <div className="login-brand-logo">
                            <div className="login-logo-icon"><TrendingUp size={28} /></div>
                            <span className="login-brand-name">Sisvest</span>
                        </div>
                        <h2 className="login-brand-title">
                            Investment Gallery<br />
                            <span className="login-brand-highlight">for Smart Investors</span>
                        </h2>
                        <p className="login-brand-desc">
                            Your AI-powered platform for financial literacy, capital market research, and data-driven investment decisions.
                        </p>
                        <div className="login-features-list">
                            {features.map((feat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                                    className="login-feature-item"
                                >
                                    <div className="login-feature-icon"><feat.icon size={20} /></div>
                                    <div>
                                        <div className="login-feature-title">{feat.title}</div>
                                        <div className="login-feature-desc">{feat.desc}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="login-brand-decor-1"></div>
                    <div className="login-brand-decor-2"></div>
                </motion.div>

                {/* Right panel */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                    className="login-form-panel"
                >
                    <div className="login-card">
                        <div className="login-header">
                            <h1>Welcome Back</h1>
                            <p>Sign in to access your dashboard</p>
                        </div>

                        {error && (
                            <motion.div className="auth-error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                {error}
                            </motion.div>
                        )}

                        <form className="login-form" onSubmit={handleLogin}>
                            <div className="input-group">
                                <label>Username</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input id="login-username" type="text" placeholder="Enter your username"
                                        value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={18} />
                                    <input id="login-password" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                                        value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                                    <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" id="remember-me-checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <button type="button" className="forgot-password" onClick={() => setModal('forgot')}>
                                    Forgot Password?
                                </button>
                            </div>

                            <button type="submit" className="login-btn" id="login-submit" disabled={isLoading}>
                                {isLoading ? <div className="login-spinner"></div> : (
                                    <><LogIn size={18} /> Sign In <ArrowRight size={16} /></>
                                )}
                            </button>

                            <div className="signup-prompt">
                                Don't have an account?{' '}
                                <button type="button" className="signup-link-btn" onClick={() => setModal('register')}>
                                    Create one now
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {modal === 'register' && (
                    <RegisterModal
                        onClose={() => setModal(null)}
                        onSuccess={(data) => {
                            setModal(null);
                            navigate(data.is_admin ? '/admin' : '/dashboard');
                        }}
                    />
                )}
                {modal === 'forgot' && (
                    <ForgotPasswordModal onClose={() => setModal(null)} />
                )}
            </AnimatePresence>
        </>
    );
}

export default Login;
