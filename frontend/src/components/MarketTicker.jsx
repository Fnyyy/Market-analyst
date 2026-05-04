import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './MarketTicker.css';

const TickerItem = ({ symbol, price, change, isPositive }) => (
    <div className="flex items-center gap-2 mx-6 text-sm font-medium whitespace-nowrap">
        <span className="text-slate-200 font-bold">{symbol}</span>
        <span className="text-slate-400">{price}</span>
        <span className={`flex items-center ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {change}
        </span>
    </div>
);

function MarketTicker() {
    const marketData = [
        { symbol: "BBCA.JK", price: "Rp 10,250", change: "+1.2%", isPositive: true },
        { symbol: "BBRI.JK", price: "Rp 6,150", change: "-0.8%", isPositive: false },
        { symbol: "TLKM.JK", price: "Rp 3,950", change: "+0.5%", isPositive: true },
        { symbol: "BMRI.JK", price: "Rp 7,200", change: "+2.1%", isPositive: true },
        { symbol: "GOTO.JK", price: "Rp 75", change: "-3.2%", isPositive: false },
        { symbol: "ASII.JK", price: "Rp 5,400", change: "+1.0%", isPositive: true },
        { symbol: "UNTR.JK", price: "Rp 24,100", change: "+0.2%", isPositive: true },
        { symbol: "ICBP.JK", price: "Rp 11,500", change: "-1.1%", isPositive: false },
        { symbol: "BBNI.JK", price: "Rp 5,800", change: "+1.5%", isPositive: true },
        { symbol: "AMMN.JK", price: "Rp 8,200", change: "+3.4%", isPositive: true },
    ];

    // Duplicate for seamless loop
    const doubledData = [...marketData, ...marketData];

    return (
        <div className="w-full bg-slate-900/60 backdrop-blur-md border-b border-white/5 overflow-hidden flex items-center h-10 relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
            
            <div className="ticker-track flex">
                {doubledData.map((item, index) => (
                    <TickerItem key={index} {...item} />
                ))}
            </div>
            
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>
        </div>
    );
}

export default MarketTicker;
