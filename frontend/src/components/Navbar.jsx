import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    BookOpen, LogOut, TrendingUp, User, Activity, Eye,
    PieChart, Home, Menu, X, ChevronDown, Bell, Settings, BarChart3
} from 'lucide-react';
import useStore from '../store';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, currentUser, logout, userProfile } = useStore();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        navigate('/login');
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Close mobile on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    if (location.pathname === '/login') return null;

    const navItems = [
        { to: '/', icon: Home, label: 'Home', end: true },
        { to: '/dashboard', icon: BarChart3, label: 'Dashboard', end: true },
        { to: '/watchlist', icon: Eye, label: 'Watchlist' },
        { to: '/dashboard/portfolio', icon: PieChart, label: 'Portfolio' },
        { to: '/research', icon: BookOpen, label: 'Research' },
        { to: '/dashboard/courses', icon: Activity, label: 'Learning' },
    ];

    const displayName = currentUser?.username || userProfile?.username || 'Guest';
    const riskProfile = userProfile?.risk_profile || 'Investor';

    const getInitials = (name) => name.slice(0, 2).toUpperCase();

    return (
        <>
            <nav className="sisvest-navbar" id="main-navbar">
                <div className="navbar-container">
                    {/* Logo */}
                    <div className="navbar-logo" onClick={() => navigate('/')} id="navbar-logo">
                        <div className="navbar-logo-icon">
                            <TrendingUp size={20} strokeWidth={2.5} />
                        </div>
                        <span className="navbar-logo-text">Sisvest</span>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="navbar-links">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                            >
                                <item.icon size={15} strokeWidth={2} />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="navbar-right">
                        {isLoggedIn ? (
                            <div className="navbar-profile-area" ref={dropdownRef}>
                                <button
                                    className="navbar-profile-btn"
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    id="navbar-profile-btn"
                                >
                                    <div className="navbar-avatar-gradient">
                                        {getInitials(displayName)}
                                    </div>
                                    <div className="navbar-user-info">
                                        <span className="navbar-user-name">{displayName}</span>
                                        <span className="navbar-user-role">{riskProfile}</span>
                                    </div>
                                    <ChevronDown
                                        size={13}
                                        className={`navbar-chevron ${profileOpen ? 'open' : ''}`}
                                        strokeWidth={2.5}
                                    />
                                </button>

                                {profileOpen && (
                                    <div className="navbar-dropdown" id="navbar-dropdown">
                                        {/* User header */}
                                        <div className="navbar-dropdown-header">
                                            <div className="navbar-dropdown-avatar-lg">
                                                {getInitials(displayName)}
                                            </div>
                                            <div>
                                                <div className="navbar-dropdown-name">{displayName}</div>
                                                <div className="navbar-dropdown-role">{riskProfile}</div>
                                            </div>
                                        </div>

                                        <div className="navbar-dropdown-divider" />

                                        <div className="navbar-dropdown-section-label">Navigation</div>
                                        <button onClick={() => { navigate('/dashboard'); setProfileOpen(false); }} className="navbar-dropdown-item">
                                            <div className="navbar-dropdown-item-icon blue"><BarChart3 size={14} /></div>
                                            Dashboard
                                        </button>
                                        <button onClick={() => { navigate('/dashboard/portfolio'); setProfileOpen(false); }} className="navbar-dropdown-item">
                                            <div className="navbar-dropdown-item-icon indigo"><PieChart size={14} /></div>
                                            My Portfolio
                                        </button>
                                        <button onClick={() => { navigate('/watchlist'); setProfileOpen(false); }} className="navbar-dropdown-item">
                                            <div className="navbar-dropdown-item-icon violet"><Eye size={14} /></div>
                                            My Watchlist
                                        </button>
                                        <button onClick={() => { navigate('/dashboard/courses'); setProfileOpen(false); }} className="navbar-dropdown-item">
                                            <div className="navbar-dropdown-item-icon teal"><Activity size={14} /></div>
                                            Learning
                                        </button>

                                        <div className="navbar-dropdown-divider" />
                                        <button onClick={handleLogout} className="navbar-dropdown-item logout" id="navbar-logout">
                                            <div className="navbar-dropdown-item-icon red"><LogOut size={14} /></div>
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="navbar-login-btn" onClick={() => navigate('/login')} id="navbar-login-btn">
                                <User size={15} />
                                Sign In
                            </button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="navbar-mobile-toggle"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {mobileOpen && (
                    <div className="navbar-mobile-menu" id="navbar-mobile-menu">
                        <div className="navbar-mobile-inner">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) => `navbar-mobile-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                            {isLoggedIn && (
                                <>
                                    <div className="navbar-mobile-divider" />
                                    <button onClick={handleLogout} className="navbar-mobile-link logout">
                                        <LogOut size={18} />
                                        <span>Sign Out</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}

export default Navbar;
