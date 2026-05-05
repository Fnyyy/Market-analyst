import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, TrendingUp, User, Activity, Bookmark, PieChart } from 'lucide-react';
import useStore from '../../store';

function Layout() {
    const navigate = useNavigate();
    const { userProfile } = useStore();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Top Sticky Navbar */}
            <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-800">Sisvest</span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-1">
                            <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <Activity size={18} /> Dashboard
                            </NavLink>
                            <NavLink to="/dashboard/portfolio" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <PieChart size={18} /> Portfolio
                            </NavLink>
                            <NavLink to="/research" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <Bookmark size={18} /> Watchlist
                            </NavLink>
                            <NavLink to="/dashboard/courses" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <BookOpen size={18} /> Learning
                            </NavLink>
                        </div>

                        {/* Profile & Actions */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <div className="font-bold text-sm text-slate-800">{userProfile ? userProfile.username : 'Investor Pro'}</div>
                                <div className="text-xs text-slate-500">{userProfile ? userProfile.risk_profile : 'Loading...'}</div>
                            </div>
                            <div className="bg-slate-100 p-2 rounded-full cursor-pointer hover:bg-slate-200 transition">
                                <User size={20} className="text-slate-600" />
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto relative max-w-7xl w-full mx-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
