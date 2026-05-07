import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Plus, Trash2, Search, TrendingUp, TrendingDown, Star, ArrowUpRight, BarChart3, Activity, X } from 'lucide-react';
import useStore from '../store';
import axios from 'axios';

function Watchlist() {
    const { watchlists, fetchWatchlists, addWatchlist, removeWatchlist } = useStore();
    const [searchInput, setSearchInput] = useState('');
    const [stockPrices, setStockPrices] = useState({});
    const [loadingPrices, setLoadingPrices] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addTicker, setAddTicker] = useState('');

    useEffect(() => {
        fetchWatchlists();
    }, []);

    useEffect(() => {
        if (watchlists.length > 0) {
            fetchPrices();
        }
    }, [watchlists]);

    const fetchPrices = async () => {
        setLoadingPrices(true);
        const prices = {};
        for (const w of watchlists) {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/analyze/${w.ticker}`);
                if (res.data) {
                    const chartData = res.data.chart_data || [];
                    const current = res.data.current_price || 0;
                    let prevClose = current;
                    if (chartData.length >= 2) {
                        prevClose = chartData[chartData.length - 2].close;
                    }
                    const change = current - prevClose;
                    const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;
                    prices[w.ticker] = {
                        price: current,
                        change: change,
                        changePct: changePct,
                        name: res.data.company_name || w.ticker,
                        predicted: res.data.predicted_price_next_day,
                        insight: res.data.market_insight,
                    };
                }
            } catch {
                prices[w.ticker] = {
                    price: 0,
                    change: 0,
                    changePct: 0,
                    name: w.ticker,
                    predicted: null,
                    insight: 'Unable to fetch data',
                };
            }
        }
        setStockPrices(prices);
        setLoadingPrices(false);
    };

    const handleAddTicker = (e) => {
        e.preventDefault();
        const ticker = addTicker.toUpperCase().trim();
        if (ticker && !watchlists.some(w => w.ticker === ticker)) {
            addWatchlist(ticker);
            setAddTicker('');
            setShowAddModal(false);
        }
    };

    const formatIDR = (val) => {
        return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val);
    };

    const filteredWatchlists = searchInput
        ? watchlists.filter(w => {
            const data = stockPrices[w.ticker];
            const name = data?.name || '';
            return w.ticker.toLowerCase().includes(searchInput.toLowerCase()) ||
                   name.toLowerCase().includes(searchInput.toLowerCase());
        })
        : watchlists;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="watchlist-page"
        >
            {/* Page Header */}
            <div className="watchlist-header">
                <div className="watchlist-header-left">
                    <div className="watchlist-header-icon">
                        <Eye size={24} />
                    </div>
                    <div>
                        <h1>My Watchlist</h1>
                        <p>Track and monitor your favorite stocks</p>
                    </div>
                </div>
                <div className="watchlist-header-actions">
                    <div className="watchlist-search-bar">
                        <Search size={16} className="watchlist-search-icon" />
                        <input 
                            type="text"
                            placeholder="Filter watchlist..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            id="watchlist-search"
                        />
                    </div>
                    <button 
                        className="watchlist-add-btn"
                        onClick={() => setShowAddModal(true)}
                        id="watchlist-add-btn"
                    >
                        <Plus size={18} />
                        Add Stock
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="watchlist-stats-row">
                <div className="watchlist-stat-card">
                    <div className="watchlist-stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                        <Star size={20} />
                    </div>
                    <div className="watchlist-stat-info">
                        <span className="watchlist-stat-value">{watchlists.length}</span>
                        <span className="watchlist-stat-label">Stocks Tracked</span>
                    </div>
                </div>
                <div className="watchlist-stat-card">
                    <div className="watchlist-stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                        <TrendingUp size={20} />
                    </div>
                    <div className="watchlist-stat-info">
                        <span className="watchlist-stat-value">
                            {Object.values(stockPrices).filter(p => p.changePct > 0).length}
                        </span>
                        <span className="watchlist-stat-label">Gainers</span>
                    </div>
                </div>
                <div className="watchlist-stat-card">
                    <div className="watchlist-stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
                        <TrendingDown size={20} />
                    </div>
                    <div className="watchlist-stat-info">
                        <span className="watchlist-stat-value">
                            {Object.values(stockPrices).filter(p => p.changePct < 0).length}
                        </span>
                        <span className="watchlist-stat-label">Decliners</span>
                    </div>
                </div>
                <div className="watchlist-stat-card">
                    <div className="watchlist-stat-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                        <Activity size={20} />
                    </div>
                    <div className="watchlist-stat-info">
                        <span className="watchlist-stat-value">
                            {Object.values(stockPrices).filter(p => p.predicted && p.predicted > p.price).length}
                        </span>
                        <span className="watchlist-stat-label">AI Buy Signals</span>
                    </div>
                </div>
            </div>

            {/* Watchlist Table */}
            {filteredWatchlists.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="watchlist-empty"
                >
                    <div className="watchlist-empty-icon">
                        <Eye size={48} />
                    </div>
                    <h3>{watchlists.length === 0 ? "Your watchlist is empty" : "No results found"}</h3>
                    <p>{watchlists.length === 0 
                        ? "Start tracking stocks by adding them to your watchlist" 
                        : "Try a different search term"
                    }</p>
                    {watchlists.length === 0 && (
                        <button className="watchlist-add-btn" onClick={() => setShowAddModal(true)}>
                            <Plus size={18} /> Add Your First Stock
                        </button>
                    )}
                </motion.div>
            ) : (
                <div className="watchlist-table-wrapper">
                    <table className="watchlist-table">
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th className="text-right">Price</th>
                                <th className="text-right">Change</th>
                                <th className="text-right">AI Forecast</th>
                                <th className="text-right">Signal</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredWatchlists.map((w, idx) => {
                                    const data = stockPrices[w.ticker];
                                    const isPositive = data ? data.changePct >= 0 : true;
                                    const hasSignal = data?.predicted && data?.price;
                                    const isBuySignal = hasSignal && data.predicted >= data.price;

                                    return (
                                        <motion.tr 
                                            key={w.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="watchlist-row"
                                        >
                                            <td>
                                                <div className="watchlist-stock-info">
                                                    <div className="watchlist-stock-badge">
                                                        <BarChart3 size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="watchlist-stock-ticker">{w.ticker}</div>
                                                        <div className="watchlist-stock-name">
                                                            {data ? data.name : 'Loading...'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <span className="watchlist-price">
                                                    {data ? `Rp ${formatIDR(data.price)}` : '—'}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                {data ? (
                                                    <span className={`watchlist-change ${isPositive ? 'positive' : 'negative'}`}>
                                                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                        {isPositive ? '+' : ''}{data.changePct.toFixed(2)}%
                                                    </span>
                                                ) : '—'}
                                            </td>
                                            <td className="text-right">
                                                <span className="watchlist-forecast">
                                                    {data?.predicted ? `Rp ${formatIDR(data.predicted)}` : '—'}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                {hasSignal ? (
                                                    <span className={`watchlist-signal ${isBuySignal ? 'buy' : 'sell'}`}>
                                                        {isBuySignal ? '▲ BUY' : '▼ SELL'}
                                                    </span>
                                                ) : (
                                                    <span className="watchlist-signal neutral">— N/A</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <button 
                                                    className="watchlist-remove-btn"
                                                    onClick={() => removeWatchlist(w.id)}
                                                    title="Remove from watchlist"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Stock Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="watchlist-modal-overlay"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="watchlist-modal"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="watchlist-modal-header">
                                <h3>Add Stock to Watchlist</h3>
                                <button onClick={() => setShowAddModal(false)} className="watchlist-modal-close">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleAddTicker} className="watchlist-modal-body">
                                <div className="input-group">
                                    <label>Ticker Symbol</label>
                                    <div className="input-wrapper">
                                        <BarChart3 className="input-icon" size={18} />
                                        <input
                                            type="text"
                                            placeholder="e.g. BBCA.JK"
                                            value={addTicker}
                                            onChange={(e) => setAddTicker(e.target.value)}
                                            required
                                            autoFocus
                                            id="watchlist-add-ticker-input"
                                        />
                                    </div>
                                </div>
                                <p className="watchlist-modal-hint">
                                    Enter a valid Yahoo Finance ticker symbol (e.g., BBCA.JK, TLKM.JK, ^JKSE)
                                </p>
                                <div className="watchlist-modal-actions">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="glass-button-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="glass-button" id="watchlist-confirm-add">
                                        <Plus size={16} /> Add to Watchlist
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default Watchlist;

// UI tweak log: commit 56 - component updates

// UI tweak log: commit 63 - component updates

// UI tweak log: commit 70 - component updates

// UI tweak log: commit 77 - component updates

// UI tweak log: commit 84 - component updates

// UI tweak log: commit 91 - component updates

// UI tweak log: commit 98 - component updates

// UI tweak log: commit 105 - component updates

// UI tweak log: commit 112 - component updates

// UI tweak log: commit 119 - component updates

// UI tweak log: commit 126 - component updates

// UI tweak log: commit 133 - component updates

// UI tweak log: commit 140 - component updates
