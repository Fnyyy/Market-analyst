import http from 'k6/http';
import { sleep, check } from 'k6';

// k6 options configuration
export const options = {
    stages: [
        { duration: '10s', target: 10 }, // Ramp-up: naik ke 10 virtual users dalam 10 detik
        { duration: '20s', target: 50 }, // Stress: pertahankan 50 virtual users selama 20 detik
        { duration: '10s', target: 0 },  // Ramp-down: turun kembali ke 0 virtual users
    ],
    thresholds: {
        http_req_failed: ['rate<0.05'], // Toleransi kegagalan request kurang dari 5%
        http_req_duration: ['p(95)<500'], // 95% request harus selesai di bawah 500ms
    },
};

const BASE_URL = 'http://localhost:8000';

export default function () {
    // 1. Get Research Reports List
    let resResearch = http.get(`${BASE_URL}/api/research`);
    check(resResearch, {
        'Research list status is 200': (r) => r.status === 200,
        'Research response time < 300ms': (r) => r.timings.duration < 300,
    });
    sleep(1);

    // 2. Get Stock Prices
    let resStocks = http.get(`${BASE_URL}/api/stocks`);
    check(resStocks, {
        'Stocks status is 200': (r) => r.status === 200,
    });
    sleep(1);

    // 3. Get Predictions
    let resPredictions = http.get(`${BASE_URL}/api/predictions`);
    check(resPredictions, {
        'Predictions status is 200': (r) => r.status === 200,
    });
    sleep(1.5);
}
