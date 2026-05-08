import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2 } from 'lucide-react';
import StockChart from '../../components/StockChart';

function Forecasting() {
  const [ticker, setTicker] = useState('BBCA');
  const [searchInput, setSearchInput] = useState('BBCA');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchStockData('BBCA');
    const interval = setInterval(() => {
      setTicker((currentSymbol) => {
        fetchStockData(currentSymbol, true); // silent refresh
        return currentSymbol;
      });
    }, 10000); // Poll every 10s

    return () => clearInterval(interval);
  }, []);

  const fetchStockData = async (searchTicker, silent = false) => {
    const t = searchTicker || ticker;
    if (!t) return;

    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    setError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/analyze/${t}`);
      setData(response.data);
    } catch (err) {
      if (!silent) setError(err.response?.data?.detail || 'Failed to fetch data or model unavailable.');
      else console.error("Live refresh failed", err);
      if (!silent) setData(null);
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTicker(searchInput.toUpperCase());
      fetchStockData(searchInput.toUpperCase());
    }
  };

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val);
  };

  const getDailyChange = () => {
    if (!data || !data.chart_data || data.chart_data.length < 2) return { value: 0, percent: 0, isPos: true };
    const current = data.chart_data[data.chart_data.length - 1].close;
    const previous = data.chart_data[data.chart_data.length - 2].close;
    const change = current - previous;
    const isPos = change >= 0;
    const percent = Math.abs((change / previous) * 100);
    return {
      value: Math.abs(change),
      percent: percent.toFixed(2),
      isPos
    };
  };

  const changeInfo = getDailyChange();

  return (
    <div className="forecasting-page">
      <div className="forecasting-header">
        <h1>GIBEI Forecasting</h1>
        <form onSubmit={handleSearch} className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search ticker (e.g. BBCA)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Analyze</button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {loading && !data && (
        <div className="loading-state">
          <Loader2 className="spinner-icon" />
          <p>Analyzing {ticker}...</p>
        </div>
      )}

      {data && (!loading || isRefreshing) && (
        <div className="dashboard-content">
          <div className="forecast-main-card">
            <div className="forecast-header">
              <div className="ticker-badge">{data.ticker}</div>
              <div className="company-info">
                <h2>{data.company_name}</h2>
                <div className="last-updated">
                  Last updated {data.last_updated} {isRefreshing && <span className="refreshing-dot"></span>}
                </div>
              </div>
            </div>

            <div className="price-overview">
              <div className="current-price">
                <span className="currency">Rp</span>
                <span className="amount">{formatIDR(data.current_price)}</span>
                <div className={`change-pill ${changeInfo.isPos ? 'up' : 'down'}`}>
                  {changeInfo.isPos ? '+' : '-'}{changeInfo.percent}% (Daily)
                </div>
              </div>

              {/* Recommendation Badge */}
              <div className="recommendation-badge">
                <span className="label">AI FORECAST (NEXT DAY)</span>
                {data.predicted_price_next_day ? (
                  <div className={`forecast-value ${data.predicted_price_next_day >= data.current_price ? 'positive' : 'negative'}`}>
                    {data.predicted_price_next_day >= data.current_price ? 'STRONG BUY' : 'SELL'}
                  </div>
                ) : (
                  <div className="forecast-value neutral">NOT ENOUGH DATA</div>
                )}
                {data.predicted_price_next_day && (
                  <div className="expected-price">Exp. {formatIDR(data.predicted_price_next_day)}</div>
                )}
              </div>
            </div>

            <div className="chart-section">
              <div className="section-title">Price Movement Analysis</div>
              <div className="chart-wrapper">
                <StockChart
                  chartData={data.chart_data}
                  anomalies={data.recent_anomalies}
                  isPos={changeInfo.isPos}
                />
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-box">
                <span className="metric-icon">📈</span>
                <div className="metric-info">
                  <span className="metric-title">High</span>
                  <span className="metric-value">{formatIDR(Math.max(...data.chart_data.map(d => d.high)))}</span>
                </div>
              </div>
              <div className="metric-box">
                <span className="metric-icon">📊</span>
                <div className="metric-info">
                  <span className="metric-title">Low</span>
                  <span className="metric-value">{formatIDR(Math.min(...data.chart_data.map(d => d.low)))}</span>
                </div>
              </div>
              <div className="metric-box">
                <span className="metric-icon">📉</span>
                <div className="metric-info">
                  <span className="metric-title">Volume</span>
                  <span className="metric-value">{formatIDR(data.chart_data[data.chart_data.length - 1].volume)}</span>
                </div>
              </div>
            </div>

            {data.recent_anomalies && data.recent_anomalies.length > 0 && (
              <div className="alerts-section">
                <div className="section-title">Critical Alerts</div>
                <div className="alerts-list">
                  {data.recent_anomalies.slice(-3).reverse().map((ano, idx) => (
                    <div key={idx} className="alert-item">
                      <span className="alert-date">{ano.date.split('T')[0]}</span>
                      <span className="alert-type">{ano.type}</span>
                      <span className="alert-impact">-{ano.drop}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Forecasting;

// UI tweak log: commit 57 - component updates

// UI tweak log: commit 64 - component updates

// UI tweak log: commit 71 - component updates

// UI tweak log: commit 78 - component updates

// UI tweak log: commit 85 - component updates

// UI tweak log: commit 92 - component updates

// UI tweak log: commit 99 - component updates

// UI tweak log: commit 106 - component updates

// UI tweak log: commit 113 - component updates

// UI tweak log: commit 120 - component updates

// UI tweak log: commit 127 - component updates

// UI tweak log: commit 134 - component updates
