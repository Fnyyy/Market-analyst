import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { TrendingUp, BarChart3, BookOpen, Shield, ArrowRight, Sparkles, Zap, Target, Brain, LineChart, ChevronRight, Globe, Lock, Award, Users, Star, ArrowUpRight } from 'lucide-react';
import useStore from '../store';

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    useEffect(() => {
        if (!isInView) return;
        const num = parseInt(target);
        if (isNaN(num)) { setCount(target); return; }
        let start = 0;
        const duration = 2000;
        const step = Math.max(1, Math.floor(num / (duration / 16)));
        const timer = setInterval(() => {
            start += step;
            if (start >= num) { setCount(num); clearInterval(timer); }
            else setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [isInView, target]);

    return <span ref={ref}>{prefix}{typeof count === 'number' ? count.toLocaleString() : count}{suffix}</span>;
}

/* ─── Floating Particles ─── */
function FloatingParticles() {
    return (
        <div className="hero-particles" aria-hidden="true">
            {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="hero-particle" style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 8}s`,
                    animationDuration: `${6 + Math.random() * 8}s`,
                    width: `${2 + Math.random() * 4}px`,
                    height: `${2 + Math.random() * 4}px`,
                    opacity: 0.15 + Math.random() * 0.3,
                }} />
            ))}
        </div>
    );
}

/* ─── Tilt Card Wrapper ─── */
function TiltCard({ children, className }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

    function handleMouse(e) {
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    }

    function handleLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function Home() {
    const { isLoggedIn } = useStore();
    const heroRef = useRef(null);
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

    // Parallax transforms for hero layers
    const heroY1 = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
    const heroY2 = useTransform(scrollYProgress, [0, 0.3], [0, -200]);
    const heroY3 = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.92]);
    const gridY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);

    const features = [
        { icon: BarChart3, title: 'Real-time Analysis', desc: 'Live stock data with AI-powered technical analysis for Indonesian markets.', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
        { icon: Brain, title: 'AI Predictions', desc: 'Machine learning models predict prices and generate smart buy/sell signals.', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
        { icon: Shield, title: 'Paper Trading', desc: 'Practice investing risk-free with virtual portfolio tracking.', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
        { icon: BookOpen, title: 'Learning Center', desc: 'Comprehensive courses from beginner to advanced investor level.', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
        { icon: Target, title: 'Smart Watchlist', desc: 'Track your favorite stocks with intelligent alerts and forecasts.', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #be185d)' },
        { icon: LineChart, title: 'Bollinger Bands', desc: 'Advanced anomaly detection reveals hidden market opportunities.', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    ];

    const stats = [
        { value: '50', suffix: '+', label: 'IDX Stocks', icon: BarChart3 },
        { value: '95', suffix: '%', label: 'AI Accuracy', icon: Zap },
        { value: '24', suffix: '/7', label: 'Access', icon: Globe },
        { value: '10', suffix: 'K+', label: 'Predictions', icon: Brain },
    ];

    const testimonials = [
        { name: 'Rina Sari', role: 'Mahasiswa Ekonomi', text: 'Sisvest membuat belajar investasi jadi sangat mudah. AI predictions-nya akurat banget!', rating: 5 },
        { name: 'Budi Pratama', role: 'Software Engineer', text: 'Platform terbaik untuk paper trading. Saya bisa belajar tanpa risiko kehilangan uang.', rating: 5 },
        { name: 'Dewi Anggraini', role: 'Financial Analyst', text: 'Analisis teknikal dan Bollinger Bands-nya sangat membantu keputusan investasi saya.', rating: 5 },
    ];

    return (
        <div className="parallax-home" ref={containerRef}>
            {/* ═══════ HERO ═══════ */}
            <section className="parallax-hero" ref={heroRef}>
                {/* Background Layers */}
                <div className="parallax-hero-bg">
                    <motion.div className="parallax-orb parallax-orb-1" style={{ y: heroY1 }} />
                    <motion.div className="parallax-orb parallax-orb-2" style={{ y: heroY2 }} />
                    <motion.div className="parallax-orb parallax-orb-3" style={{ y: heroY3 }} />
                    <motion.div className="parallax-mesh" style={{ y: gridY }} />
                    <FloatingParticles />
                    <div className="parallax-radial-fade" />
                </div>

                <motion.div
                    className="parallax-hero-content"
                    style={{ opacity: heroOpacity, scale: heroScale }}
                >
                    <motion.div
                        className="parallax-hero-badge"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="badge-dot" />
                        <span>Sisvest Investment Gallery</span>
                        <Sparkles size={14} />
                    </motion.div>

                    <motion.h1
                        className="parallax-hero-title"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Empowering Young
                        <br />
                        <span className="parallax-gradient-text">Smart Investors</span>
                    </motion.h1>

                    <motion.p
                        className="parallax-hero-subtitle"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        A futuristic center for financial literacy, capital market research,
                        and data-driven financial technology innovation powered by AI.
                    </motion.p>

                    <motion.div
                        className="parallax-hero-actions"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                    >
                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard" className="parallax-btn-primary" id="home-cta-dashboard">
                                    <span>Go to Dashboard</span>
                                    <ArrowRight size={18} />
                                </Link>
                                <Link to="/watchlist" className="parallax-btn-ghost" id="home-cta-watchlist">
                                    <span>My Watchlist</span>
                                    <ChevronRight size={16} />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="parallax-btn-primary" id="home-cta-login">
                                    <span>Get Started Free</span>
                                    <ArrowRight size={18} />
                                </Link>
                                <Link to="/research" className="parallax-btn-ghost" id="home-cta-research">
                                    <span>View Research</span>
                                    <ChevronRight size={16} />
                                </Link>
                            </>
                        )}
                    </motion.div>

                    {/* Floating Stat Cards */}
                    <motion.div
                        className="parallax-hero-stats"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                className="parallax-stat-pill"
                                whileHover={{ y: -4, scale: 1.03 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div className="stat-pill-icon">
                                    <stat.icon size={16} />
                                </div>
                                <div className="stat-pill-text">
                                    <span className="stat-pill-value">
                                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                    </span>
                                    <span className="stat-pill-label">{stat.label}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="scroll-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    <div className="scroll-mouse">
                        <div className="scroll-wheel" />
                    </div>
                    <span>Scroll to explore</span>
                </motion.div>
            </section>

            {/* ═══════ MARQUEE STRIP ═══════ */}
            <section className="marquee-section">
                <div className="marquee-track">
                    {[...Array(2)].map((_, setIdx) => (
                        <div className="marquee-content" key={setIdx}>
                            {['REAL-TIME DATA', 'AI PREDICTIONS', 'PAPER TRADING', 'BOLLINGER BANDS', 'IDX MARKET', 'SMART WATCHLIST', 'FINANCIAL LITERACY', 'MACHINE LEARNING'].map((text, i) => (
                                <React.Fragment key={i}>
                                    <span className="marquee-item">{text}</span>
                                    <span className="marquee-dot">◆</span>
                                </React.Fragment>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════ FEATURES ═══════ */}
            <section className="parallax-features-section">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-tag">Features</span>
                    <h2>Everything You Need to<br /><span className="parallax-gradient-text">Invest Smarter</span></h2>
                    <p>Cutting-edge AI technology meets comprehensive financial education</p>
                </motion.div>

                <div className="parallax-features-grid">
                    {features.map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                        >
                            <TiltCard className="parallax-feature-card">
                                <div className="feature-card-glow" style={{ background: feat.gradient }} />
                                <div className="feature-card-icon" style={{ background: feat.gradient }}>
                                    <feat.icon size={22} strokeWidth={2} />
                                </div>
                                <h3>{feat.title}</h3>
                                <p>{feat.desc}</p>
                                <div className="feature-card-link" style={{ color: feat.color }}>
                                    Learn more <ArrowUpRight size={14} />
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════ HOW IT WORKS ═══════ */}
            <section className="parallax-howit-section">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-tag">How It Works</span>
                    <h2>Start Investing in<br /><span className="parallax-gradient-text">3 Simple Steps</span></h2>
                </motion.div>

                <div className="howit-steps">
                    {[
                        { step: '01', title: 'Create Account', desc: 'Sign up in seconds and set up your risk profile.', icon: Users },
                        { step: '02', title: 'Explore Markets', desc: 'Browse IDX stocks with AI-powered insights and predictions.', icon: LineChart },
                        { step: '03', title: 'Start Trading', desc: 'Practice with paper trading or build your smart watchlist.', icon: TrendingUp },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="howit-step"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                        >
                            <div className="howit-step-number">{item.step}</div>
                            <div className="howit-step-connector" />
                            <div className="howit-step-content">
                                <div className="howit-step-icon">
                                    <item.icon size={22} />
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════ TESTIMONIALS ═══════ */}
            <section className="parallax-testimonials-section">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="section-tag">Testimonials</span>
                    <h2>Loved by <span className="parallax-gradient-text">Investors</span></h2>
                    <p>See what our users are saying about their experience</p>
                </motion.div>

                <div className="testimonials-grid">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            className="testimonial-card"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: i * 0.12, duration: 0.5 }}
                            whileHover={{ y: -6 }}
                        >
                            <div className="testimonial-stars">
                                {Array.from({ length: t.rating }).map((_, j) => (
                                    <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                                ))}
                            </div>
                            <p className="testimonial-text">"{t.text}"</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">
                                    {t.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <span className="testimonial-name">{t.name}</span>
                                    <span className="testimonial-role">{t.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════ CTA ═══════ */}
            <section className="parallax-cta-section">
                <motion.div
                    className="parallax-cta-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="cta-bg-pattern" />
                    <div className="cta-glow-1" />
                    <div className="cta-glow-2" />
                    <div className="parallax-cta-content">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            Ready to Start Your<br />Investment Journey?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                        >
                            Join thousands of young investors learning and growing with AI-powered analytics.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <Link to={isLoggedIn ? '/dashboard' : '/login'} className="parallax-btn-cta" id="home-bottom-cta">
                                <span>{isLoggedIn ? 'Go to Dashboard' : 'Get Started — It\'s Free'}</span>
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* ═══════ FOOTER ═══════ */}
            <footer className="parallax-footer">
                <div className="parallax-footer-inner">
                    <div className="parallax-footer-brand">
                        <div className="footer-logo-icon">
                            <TrendingUp size={18} />
                        </div>
                        <span className="footer-logo-text">Sisvest</span>
                    </div>
                    <div className="parallax-footer-links">
                        <Link to="/research">Research</Link>
                        <Link to="/dashboard/courses">Courses</Link>
                        <Link to="/login">Sign In</Link>
                    </div>
                    <p className="parallax-footer-copy">© 2026 Sisvest Investment Gallery. Real-time market data · AI-powered insights.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
