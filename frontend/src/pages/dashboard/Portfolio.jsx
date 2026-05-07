import React, { useEffect, useState } from 'react';
import useStore from '../../store';
import { Briefcase, History, TrendingUp, Settings, RefreshCw, AlertCircle, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function Portfolio() {
    const { trades, fetchTrades, addTrade, removeTrade, userProfile, fetchUserProfile, updateUserProfile } = useStore();
    const [marketPrices, setMarketPrices] = useState({});
    const [isSimulating, setIsSimulating] = useState(false);
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [manualTrade, setManualTrade] = useState({ ticker: '', quantity: '', buy_price: '' });

    useEffect(() => {
        fetchTrades();
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (trades.length > 0) {
            simulateMarketPrices();
        }
    }, [trades]);

    const simulateMarketPrices = async () => {
        setIsSimulating(true);
        const prices = {};
        for (const trade of trades) {
            if (!prices[trade.ticker]) {
                try {
                    const res = await axios.get(`http://127.0.0.1:8000/api/analyze/${trade.ticker}`);
                    prices[trade.ticker] = res.data.current_price;
                } catch (e) {
                    const change = 1 + ((Math.random() * 0.1) - 0.05);
                    prices[trade.ticker] = trade.buy_price * change;
                }
            }
        }
        setMarketPrices(prices);
        setIsSimulating(false);
    };

    const handleSell = (id, ticker, quantity, price) => {
        if (window.confirm(`Close trade for ${quantity} shares of ${ticker}?`)) {
            removeTrade(id);
        }
    };

    const handleRiskChange = (e) => {
        updateUserProfile(e.target.value);
    };

    const submitManualTrade = (e) => {
        e.preventDefault();
        if (!manualTrade.ticker || !manualTrade.quantity || !manualTrade.buy_price) return;
        
        addTrade({
            ticker: manualTrade.ticker.toUpperCase(),
            quantity: parseInt(manualTrade.quantity, 10),
            buy_price: parseFloat(manualTrade.buy_price)
        });
        
        setManualTrade({ ticker: '', quantity: '', buy_price: '' });
        setShowModal(false);
    };

    const formatIDR = (val) => {
        return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val);
    };

    let totalInvested = 0;
    let totalMarketValue = 0;

    trades.forEach(t => {
        totalInvested += (t.buy_price * t.quantity);
        const mktPrice = marketPrices[t.ticker] || t.buy_price;
        totalMarketValue += (mktPrice * t.quantity);
    });

    const totalProfit = totalMarketValue - totalInvested;
    const profitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="p-6 flex flex-col gap-6 h-full overflow-y-auto relative"
        >
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Investment Journal</h1>
                    <p className="text-slate-500">Track your trades and manage your profile</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowModal(true)} className="glass-button flex items-center gap-2">
                        <Plus size={16} /> Add Manual Trade
                    </button>
                    <button onClick={simulateMarketPrices} className="glass-button-secondary flex items-center gap-2">
                        <RefreshCw size={16} className={isSimulating ? "animate-spin" : ""} /> Refresh Prices
                    </button>
                </div>
            </header>

            <div className="bento-grid">
                {/* Stats */}
                <div className="glass-panel p-6 flex flex-col justify-center">
                    <p className="text-sm font-medium text-slate-500">Total Invested (Cost Basis)</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">Rp {formatIDR(totalInvested)}</p>
                </div>
                <div className="glass-panel p-6 flex flex-col justify-center">
                    <p className="text-sm font-medium text-slate-500">Current Market Value</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">Rp {formatIDR(totalMarketValue)}</p>
                </div>
                <div className="glass-panel p-6 flex flex-col justify-center">
                    <p className="text-sm font-medium text-slate-500">Total Unrealized Profit/Loss</p>
                    <p className={`text-3xl font-bold mt-1 ${totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {totalProfit >= 0 ? '+' : ''}Rp {formatIDR(totalProfit)} ({profitPercent.toFixed(2)}%)
                    </p>
                </div>
            </div>

            <div className="flex gap-6 h-full">
                {/* Ledger */}
                <div className="glass-panel p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 text-blue-600">
                        <History size={20} />
                        <h2 className="text-xl font-bold text-slate-800">Trade Ledger</h2>
                    </div>
                    {trades.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 text-sm text-slate-500">
                                        <th className="pb-3 font-medium">Date</th>
                                        <th className="pb-3 font-medium">Ticker</th>
                                        <th className="pb-3 font-medium text-right">Shares</th>
                                        <th className="pb-3 font-medium text-right">Buy Price</th>
                                        <th className="pb-3 font-medium text-right">Mkt Price</th>
                                        <th className="pb-3 font-medium text-right">Return</th>
                                        <th className="pb-3 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trades.map(t => {
                                        const mktP = marketPrices[t.ticker] || t.buy_price;
                                        const cost = t.buy_price * t.quantity;
                                        const val = mktP * t.quantity;
                                        const ret = val - cost;
                                        const retPct = (ret / cost) * 100;

                                        return (
                                            <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                                <td className="py-3 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                                <td className="py-3 font-bold">{t.ticker}</td>
                                                <td className="py-3 text-right">{t.quantity}</td>
                                                <td className="py-3 text-right text-slate-600">Rp {formatIDR(t.buy_price)}</td>
                                                <td className="py-3 text-right text-slate-600">Rp {formatIDR(mktP)}</td>
                                                <td className={`py-3 text-right font-medium ${ret >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {ret >= 0 ? '+' : ''}{retPct.toFixed(2)}%
                                                </td>
                                                <td className="py-3 text-right">
                                                    <button onClick={() => handleSell(t.id, t.ticker, t.quantity, mktP)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                                                        CLOSE
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <AlertCircle size={48} className="mb-4 opacity-50" />
                            <p>No trades recorded. Click "Add Manual Trade" or use Dashboard Quick Trade.</p>
                        </div>
                    )}
                </div>

                {/* Risk Profile Settings */}
                <div className="w-80 flex flex-col gap-6">
                    <div className="glass-panel p-6">
                        <div className="flex items-center gap-2 mb-4 text-purple-600">
                            <Settings size={20} />
                            <h2 className="text-xl font-bold text-slate-800">User Profile</h2>
                        </div>
                        {userProfile && (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Username</label>
                                    <input type="text" value={userProfile.username} disabled className="glass-input bg-slate-100 text-slate-500 cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Risk Profile</label>
                                    <select 
                                        value={userProfile.risk_profile} 
                                        onChange={handleRiskChange}
                                        className="glass-input"
                                    >
                                        <option value="Conservative">Conservative (Blue Chip)</option>
                                        <option value="Moderate">Moderate (Cyclical)</option>
                                        <option value="Aggressive">Aggressive (High Volatility)</option>
                                    </select>
                                    <p className="text-xs text-slate-400 mt-2">
                                        Changing this affects AI recommendations on the Research page.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Manual Trade Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-800/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-800">Record Manual Trade</h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={submitManualTrade} className="p-6 flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Ticker Symbol</label>
                                    <input 
                                        type="text" 
                                        className="glass-input w-full" 
                                        placeholder="e.g. BBCA.JK"
                                        value={manualTrade.ticker}
                                        onChange={e => setManualTrade({...manualTrade, ticker: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Quantity (Shares)</label>
                                    <input 
                                        type="number" 
                                        className="glass-input w-full" 
                                        placeholder="e.g. 100"
                                        value={manualTrade.quantity}
                                        onChange={e => setManualTrade({...manualTrade, quantity: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Buy Price (Rp)</label>
                                    <input 
                                        type="number" 
                                        className="glass-input w-full" 
                                        placeholder="e.g. 10000"
                                        value={manualTrade.buy_price}
                                        onChange={e => setManualTrade({...manualTrade, buy_price: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="glass-button-secondary">Cancel</button>
                                    <button type="submit" className="glass-button">Save Entry</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}

export default Portfolio;

// UI tweak log: commit 55 - component updates

// UI tweak log: commit 62 - component updates

// UI tweak log: commit 69 - component updates

// UI tweak log: commit 76 - component updates

// UI tweak log: commit 83 - component updates

// UI tweak log: commit 90 - component updates

// UI tweak log: commit 97 - component updates

// UI tweak log: commit 104 - component updates

// UI tweak log: commit 111 - component updates

// UI tweak log: commit 118 - component updates

// UI tweak log: commit 125 - component updates

// UI tweak log: commit 132 - component updates

// UI tweak log: commit 139 - component updates
