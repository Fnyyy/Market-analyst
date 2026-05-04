import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MarketTicker from './components/MarketTicker';
import Home from './pages/Home';
import Login from './pages/Login';
import Watchlist from './pages/Watchlist';
import StockDashboard from './pages/dashboard/StockDashboard';
import Courses from './pages/dashboard/Courses';
import CourseViewer from './pages/dashboard/CourseViewer';
import Research from './pages/Research';
import ResearchDetail from './pages/ResearchDetail';
import Portfolio from './pages/dashboard/Portfolio';
import AdminPanel from './pages/admin/AdminPanel';
import useStore from './store';

function ProtectedRoute({ children }) {
    const { isLoggedIn } = useStore();
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return children;
}

function AdminRoute({ children }) {
    const { isLoggedIn, currentUser } = useStore();
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (!currentUser?.is_admin) return <Navigate to="/dashboard" replace />;
    return children;
}

function App() {
    const { isLoggedIn, currentUser } = useStore();
    // Don't show global navbar/ticker on admin panel pages
    const isAdmin = currentUser?.is_admin;

    return (
        <div className="flex flex-col min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-50">
            {!isAdmin && <Navbar />}
            {isLoggedIn && !isAdmin && <MarketTicker />}

            <main className="flex-1 w-full mx-auto flex flex-col overflow-hidden relative">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/research/:id" element={<ResearchDetail />} />

                    {/* Admin Route */}
                    <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

                    {/* Protected Routes */}
                    <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />

                    <Route path="/dashboard">
                        <Route index element={<ProtectedRoute><StockDashboard /></ProtectedRoute>} />
                        <Route path="portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
                        <Route path="courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                        <Route path="courses/:id" element={<ProtectedRoute><CourseViewer /></ProtectedRoute>} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
