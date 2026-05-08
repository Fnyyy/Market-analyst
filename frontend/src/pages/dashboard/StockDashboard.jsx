import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockChart from '../../components/StockChart';
import { Search, TrendingUp, TrendingDown, Activity, AlertTriangle, Lightbulb, Briefcase, Plus, Trash2, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../../store';

function StockDashboard() {
    const { watchlists, fetchWatchlists, addWatchlist, removeWatchlist, addTrade, alerts, fetchAlerts, addAlert, removeAlert } = useStore();
    const [activeStock, setActiveStock] = useState({ symbol: '^JKSE', name: 'IHSG' });
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    
    // Trade / Alert inputs
    const [tradeQty, setTradeQty] = useState(100);
    const [alertPrice, setAlertPrice] = useState('');

    useEffect(() => {
        fetchWatchlists();
        fetchAlerts();
    }, []);

    useEffect(() => {
        if (watchlists.length > 0 && activeStock.symbol === '^JKSE') {
            setActiveStock({ symbol: watchlists[0].ticker, name: watchlists[0].ticker });
        }
    }, [watchlists]);

    useEffect(() => {
        fetchStockData(activeStock.symbol);
    }, [activeStock]);

    const fetchStockData = async (ticker) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/analyze/${ticker}`);
            if (response.data) {
                setStockData(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch data.');
            setStockData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            const upperTicker = searchInput.toUpperCase().trim();
            setActiveStock({ symbol: upperTicker, name: upperTicker });
            setSearchInput('');
        }
    };

    const handleAddWatchlist = () => {
        if (activeStock && activeStock.symbol !== '^JKSE') {
            addWatchlist(activeStock.symbol);
        }
    };

    const handleBuy = () => {
        if (!stockData || tradeQty <= 0) return;
        addTrade({
            ticker: stockData.ticker,
            buy_price: stockData.current_price,
            quantity: parseInt(tradeQty, 10)
        });
        alert('Trade added to Ledger!');
    };

    const handleSetAlert = () => {
        if (!stockData || !alertPrice) return;
        addAlert({
            ticker: stockData.ticker,
            target_price: parseFloat(alertPrice)
        });
        setAlertPrice('');
        alert('Price Alert Set!');
    };

    const formatIDR = (val) => {
        return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val);
    };

    const getDailyChange = () => {
        if (!stockData || !stockData.chart_data || stockData.chart_data.length < 2)
            return { value: 0, percent: 0, isPos: true };
        const current = stockData.chart_data[stockData.chart_data.length - 1].close;
        const previous = stockData.chart_data[stockData.chart_data.length - 2].close;
        const change = current - previous;
        const isPos = change >= 0;
        const percent = Math.abs((change / previous) * 100);
        return { value: Math.abs(change), percent: percent.toFixed(2), isPos };
    };

    const changeInfo = getDailyChange();
    const isIndex = activeStock.symbol === '^JKSE';
    const activeAlerts = alerts.filter(a => a.ticker === activeStock.symbol);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col md:flex-row gap-6 p-6 lg:p-10"
        >
            {/* Sidebar Watchlist */}
            <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 flex flex-col gap-6">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search ticker (e.g. BBCA)"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="glass-input pl-10"
                    />
                </form>

                <div className="flex flex-col gap-3">
                    <h3 className="font-semibold text-slate-400 text-sm tracking-wider uppercase flex items-center gap-2">
                        <Activity size={16} /> Market Index
                    </h3>
                    <div 
                        onClick={() => setActiveStock({ symbol: '^JKSE', name: 'IHSG' })}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            activeStock.symbol === '^JKSE' 
                                ? 'bg-cyan-900/40 border-cyan-500/50 text-cyan-50' 
                                : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60 text-slate-300'
                        }`}
                    >
                        <div className="font-bold text-lg">IHSG</div>
                        <div className="text-sm opacity-80">Composite Index</div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="font-semibold text-slate-400 text-sm tracking-wider uppercase flex items-center gap-2 mt-2">
                        <TrendingUp size={16} /> My Watchlist
                    </h3>
                    {watchlists.length === 0 && (
                        <div className="text-slate-500 text-sm p-4 text-center border border-dashed border-white/10 rounded-xl">
                            Watchlist is empty.<br/>Search a stock to add.
                        </div>
                    )}
                    {watchlists.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => setActiveStock({ symbol: item.ticker, name: item.ticker })}
                            className={`p-4 rounded-xl border flex justify-between items-center cursor-pointer transition-all group ${
                                activeStock.symbol === item.ticker 
                                ? 'bg-cyan-900/40 border-cyan-500/50 text-cyan-50 shadow-lg shadow-cyan-900/20' 
                                : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60 text-slate-300'
                            }`}
                        >
                            <div>
                                <div className="font-bold text-lg">{item.ticker}</div>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeWatchlist(item.id);
                                }}
                                className="text-rose-400 hover:text-rose-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content: Bento Grid */}
            <main className="flex-1 flex flex-col gap-6 overflow-y-auto">
                {loading && (
                    <div className="flex flex-col gap-6">
                        <div className="glass-panel p-6 flex flex-col gap-6 animate-pulse">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3">
                                    <div className="h-8 bg-slate-800 rounded w-32"></div>
                                    <div className="h-4 bg-slate-800 rounded w-48"></div>
                                </div>
                                <div className="space-y-3 text-right">
                                    <div className="h-8 bg-slate-800 rounded w-32"></div>
                                    <div className="h-4 bg-slate-800 rounded w-24 ml-auto"></div>
                                </div>
                            </div>
                            <div className="h-[300px] w-full bg-slate-800/50 rounded-xl"></div>
                        </div>
                        <div className="bento-grid">
                            <div className="glass-panel p-6 h-[200px] bg-slate-800/50 animate-pulse"></div>
                            <div className="glass-panel p-6 h-[200px] bg-slate-800/50 animate-pulse"></div>
                            <div className="glass-panel p-6 h-[200px] bg-slate-800/50 animate-pulse"></div>
                        </div>
                    </div>
                )}
                {error && !loading && (
                    <div className="glass-panel p-8 flex flex-col items-center justify-center min-h-[400px] text-rose-500">
                        <AlertTriangle size={48} className="mb-4" />
                        <p>{error}</p>
                    </div>
                )}
                {!loading && !error && stockData && (
                    <div className="flex flex-col gap-6 h-full">
                        {/* Header & Main Chart - span full */}
                        <div className="glass-panel p-6 flex flex-col gap-6 relative overflow-hidden">
                            {/* Subtle glowing orb in background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                                <div>
                                    <h1 className="text-3xl font-extrabold text-white tracking-tight">{stockData.ticker}</h1>
                                    <p className="text-slate-400 font-medium">{stockData.company_name}</p>
                                </div>
                                <div className="text-right mt-4 md:mt-0">
                                    <div className="text-3xl font-bold text-white">Rp {formatIDR(stockData.current_price)}</div>
                                    <div className={`text-lg font-medium flex items-center justify-end gap-1 ${changeInfo.isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {changeInfo.isPos ? '+' : '-'}Rp {formatIDR(changeInfo.value)} ({changeInfo.percent}%)
                                        {changeInfo.isPos ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                    </div>
                                </div>
                                {!watchlists.some(w => w.ticker === stockData.ticker) && stockData.ticker !== 'IHSG' && (
                                    <button onClick={handleAddWatchlist} className="glass-button flex items-center gap-2 mt-4 md:mt-0">
                                        <Plus size={18} /> Add to Watchlist
                                    </button>
                                )}
                            </div>
                            <div className="h-[300px] w-full relative z-10">
                                <StockChart chartData={stockData.chart_data} anomalies={stockData.recent_anomalies} isPos={changeInfo.isPos} />
                            </div>
                        </div>

                        {/* Bento Grid Features */}
                        <div className="bento-grid">
                            {!isIndex && (
                                <>
                                    {/* Quick Trade */}
                                    <div className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group">
                                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
                                        <div className="flex items-center gap-2 text-cyan-400 mb-2 relative z-10">
                                            <Briefcase size={20} />
                                            <h3 className="font-bold text-lg text-white">Quick Trade</h3>
                                        </div>
                                        <div className="flex flex-col gap-3 relative z-10">
                                            <input 
                                                type="number" 
                                                className="glass-input" 
                                                value={tradeQty}
                                                onChange={e => setTradeQty(e.target.value)}
                                                placeholder="Quantity"
                                            />
                                            <button onClick={handleBuy} className="w-full py-2.5 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all">
                                                BUY {tradeQty} SHARES
                                            </button>
                                            <p className="text-sm text-slate-400 mt-2 text-center">
                                                Cost: Rp {formatIDR(tradeQty * stockData.current_price)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Smart Price Alerts */}
                                    <div className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group">
                                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all duration-500"></div>
                                        <div className="flex items-center gap-2 text-amber-400 mb-2 relative z-10">
                                            <Bell size={20} />
                                            <h3 className="font-bold text-lg text-white">Smart Alerts</h3>
                                        </div>
                                        <div className="flex flex-col gap-3 relative z-10">
                                            <div className="flex gap-2">
                                                <input 
                                                    type="number" 
                                                    className="glass-input" 
                                                    value={alertPrice}
                                                    onChange={e => setAlertPrice(e.target.value)}
                                                    placeholder="Target Price"
                                                />
                                                <button onClick={handleSetAlert} className="px-4 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 rounded-lg shadow-lg transition-all flex items-center justify-center">
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                            <div className="flex flex-col gap-2 mt-2 h-[80px] overflow-y-auto custom-scrollbar">
                                                {activeAlerts.length === 0 && <p className="text-sm text-slate-500 italic">No active alerts.</p>}
                                                {activeAlerts.map(a => (
                                                    <div key={a.id} className="flex justify-between items-center text-sm p-2 bg-slate-900/50 rounded-lg border border-white/5">
                                                        <span className="text-slate-200">Rp {formatIDR(a.target_price)}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${a.status === 'Active' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                                {a.status}
                                                            </span>
                                                            <button 
                                                                onClick={() => removeAlert(a.id)} 
                                                                className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition-colors"
                                                                title="Cancel Alert"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Market Insight / Forecast */}
                            <div className={`glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group ${isIndex ? 'col-span-full md:col-span-2 lg:col-span-3' : ''}`}>
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
                                <div className="flex items-center gap-2 text-purple-400 mb-2 relative z-10">
                                    <Lightbulb size={20} />
                                    <h3 className="font-bold text-lg text-white">AI Insight</h3>
                                </div>
                                {stockData.predicted_price_next_day && (
                                    <div className="mb-4 relative z-10">
                                        <p className="text-sm text-slate-400">Forecast (Tomorrow)</p>
                                        <div className="text-2xl font-bold text-white mt-1">Rp {formatIDR(stockData.predicted_price_next_day)}</div>
                                        {!isIndex && (
                                        <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md text-xs font-bold border ${stockData.predicted_price_next_day >= stockData.current_price ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                                            {stockData.predicted_price_next_day >= stockData.current_price ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                                            {stockData.predicted_price_next_day >= stockData.current_price ? 'BUY SIGNAL' : 'SELL SIGNAL'}
                                        </div>
                                        )}
                                    </div>
                                )}
                                <p className="text-sm text-slate-300 leading-relaxed relative z-10">
                                    {stockData.market_insight}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </motion.div>
    );
}

export default StockDashboard;

// UI tweak log: commit 54 - component updates

// UI tweak log: commit 61 - component updates

// UI tweak log: commit 68 - component updates

// UI tweak log: commit 75 - component updates

// UI tweak log: commit 82 - component updates

// UI tweak log: commit 89 - component updates

// UI tweak log: commit 96 - component updates

// UI tweak log: commit 103 - component updates

// UI tweak log: commit 110 - component updates

// UI tweak log: commit 117 - component updates

// UI tweak log: commit 124 - component updates

// UI tweak log: commit 131 - component updates

// UI tweak log: commit 138 - component updates
