// Portfolio CRUD Logic using LocalStorage
// Simulates a backend for paper trading/stock simulation

const PORTFOLIO_KEY = 'sisvest_portfolio';
const INITIAL_CASH = 100000000; // Rp 100,000,000

// Helper to get or initialize portfolio
export const getPortfolio = () => {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    if (data) {
        return JSON.parse(data);
    }
    const initialPortfolio = {
        cashBalance: INITIAL_CASH,
        holdings: {},
        history: []
    };
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(initialPortfolio));
    return initialPortfolio;
};

// Helper to save portfolio
const savePortfolio = (portfolio) => {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
};

// CREATE / UPDATE: Buy Stock
// Returns { success: boolean, message: string }
export const buyStock = (symbol, name, price, quantity) => {
    const portfolio = getPortfolio();
    const totalCost = price * quantity;

    if (portfolio.cashBalance < totalCost) {
        return { success: false, message: 'Insufficient cash balance.' };
    }

    // Deduct cash
    portfolio.cashBalance -= totalCost;

    // Update or Create Holding
    if (portfolio.holdings[symbol]) {
        // Average up/down
        const holding = portfolio.holdings[symbol];
        const newTotalCost = (holding.averagePrice * holding.quantity) + totalCost;
        const newQuantity = holding.quantity + quantity;
        holding.averagePrice = newTotalCost / newQuantity;
        holding.quantity = newQuantity;
    } else {
        portfolio.holdings[symbol] = {
            symbol,
            name,
            averagePrice: price,
            quantity: quantity
        };
    }

    // Add exactly history record
    portfolio.history.unshift({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: 'BUY',
        symbol,
        name,
        price,
        quantity,
        totalValue: totalCost
    });

    savePortfolio(portfolio);
    return { success: true, message: `Successfully bought ${quantity} shares of ${symbol}.` };
};

// DELETE: Sell Stock
export const sellStock = (symbol, price, quantity) => {
    const portfolio = getPortfolio();
    
    if (!portfolio.holdings[symbol] || portfolio.holdings[symbol].quantity < quantity) {
        return { success: false, message: 'Insufficient shares to sell.' };
    }

    const totalRevenue = price * quantity;

    // Add cash
    portfolio.cashBalance += totalRevenue;

    // Reduce or Remove holding
    const holding = portfolio.holdings[symbol];
    holding.quantity -= quantity;

    if (holding.quantity <= 0) {
        delete portfolio.holdings[symbol];
    }

    // Add history record
    portfolio.history.unshift({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: 'SELL',
        symbol,
        name: holding.name,
        price,
        quantity,
        totalValue: totalRevenue // Total earned
    });

    savePortfolio(portfolio);
    return { success: true, message: `Successfully sold ${quantity} shares of ${symbol}.` };
};

// Helper: Reset portfolio for testing
export const resetPortfolio = () => {
    localStorage.removeItem(PORTFOLIO_KEY);
    return getPortfolio();
};
