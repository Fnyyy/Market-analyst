import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceDot,
    CartesianGrid
} from 'recharts';

function StockChart({ chartData, anomalies, isPos }) {
    const anomalyDates = useMemo(() => {
        const dates = new Set();
        if (anomalies) {
            anomalies.forEach(a => dates.add(a.date));
        }
        return dates;
    }, [anomalies]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const isAnomaly = anomalyDates.has(label);
            return (
                <div style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: `1px solid ${isAnomaly ? 'rgba(244, 63, 94, 0.4)' : 'rgba(34, 211, 238, 0.2)'}`,
                    padding: '16px 20px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
                    color: '#f8fafc',
                    fontFamily: "'Inter', sans-serif",
                    minWidth: '160px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {isAnomaly ? (
                        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #f43f5e, #fb7185)'}} />
                    ) : (
                        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #06b6d4, #22d3ee)'}} />
                    )}
                    
                    <div style={{ color: '#94a3b8', marginBottom: '8px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {new Date(label).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Rp</span>
                        <span style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', color: '#ffffff', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                            {new Intl.NumberFormat('id-ID').format(payload[0].value)}
                        </span>
                    </div>
                    {isAnomaly && (
                        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: '700', fontSize: '12px', background: 'rgba(244, 63, 94, 0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(244,63,94,0.2)' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 10px rgba(244, 63, 94, 1)' }}></span>
                            MARKET ANOMALY
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    if (!chartData || chartData.length === 0) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontFamily: "'Inter', sans-serif", fontWeight: '500' }}>
            Data tidak tersedia
        </div>
    );

    // Dark glowing neon palette
    const lineColor = isPos ? '#22d3ee' : '#fb7185'; // Neon Cyan / Neon Rose
    const gradientStart = isPos ? '#06b6d4' : '#e11d48';
    const gradientId = isPos ? 'colorCyan' : 'colorRose';

    const minClose = Math.min(...chartData.map(d => d.close));
    const maxClose = Math.max(...chartData.map(d => d.close));
    const padding = (maxClose - minClose) * 0.2;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={chartData}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={gradientStart} stopOpacity={0.6} />
                        <stop offset="50%" stopColor={lineColor} stopOpacity={0.15} />
                        <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="anomalyGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke="rgba(255, 255, 255, 0.05)" 
                />

                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#475569', fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                    tickFormatter={(val) => {
                        const date = new Date(val);
                        return `${date.getDate()} ${date.toLocaleString('id-ID', { month: 'short' }).toUpperCase()}`;
                    }}
                    minTickGap={60}
                    dy={10}
                />
                
                <YAxis
                    domain={[minClose - padding, maxClose + padding]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#475569', fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                    tickFormatter={(val) => {
                        if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
                        return val;
                    }}
                    orientation="right"
                    dx={10}
                />

                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: 'rgba(34, 211, 238, 0.4)', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                />

                <Area
                    type="monotone"
                    dataKey="close"
                    stroke={lineColor}
                    strokeWidth={4}
                    fillOpacity={1}
                    fill={`url(#${gradientId})`}
                    activeDot={{ r: 6, fill: '#0f172a', stroke: lineColor, strokeWidth: 3, filter: 'url(#glow)' }}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    style={{ filter: 'url(#glow)' }}
                />

                {chartData.map((point, index) => {
                    if (anomalyDates.has(point.date)) {
                        return (
                            <ReferenceDot
                                key={`anomaly-${index}`}
                                x={point.date}
                                y={point.close}
                                r={6}
                                fill="#f43f5e"
                                stroke="#ffffff"
                                strokeWidth={2}
                                filter="url(#anomalyGlow)"
                            />
                        );
                    }
                    return null;
                })}
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default StockChart;
