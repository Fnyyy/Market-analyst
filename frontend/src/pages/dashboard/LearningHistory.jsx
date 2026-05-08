import React from 'react';

function LearningHistory() {
    return (
        <div className="dashboard-page">
            <h1>Learning History</h1>
            <p className="subtitle">Continue your learning from where you left off.</p>

            <div className="course-list">
                <div className="course-item">
                    <div className="course-img-placeholder">Image</div>
                    <div className="course-details">
                        <h3>Accounting 101</h3>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '100%' }}></div>
                        </div>
                        <div className="progress-stats">
                            <span className="completed-text">100% COMPLETED</span>
                            <span className="lessons-text">2/2 LESSONS</span>
                        </div>
                        <div className="course-footer">
                            <span className="last-accessed">LAST ACCESSED: FEB 8</span>
                            <button className="review-btn">REVIEW MATERIAL &rarr;</button>
                        </div>
                    </div>
                </div>

                <div className="course-item">
                    <div className="course-img-placeholder">Image</div>
                    <div className="course-details">
                        <h3>Fundamental Analisis 101</h3>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '100%' }}></div>
                        </div>
                        <div className="progress-stats">
                            <span className="completed-text">100% COMPLETED</span>
                            <span className="lessons-text">1/1 LESSONS</span>
                        </div>
                        <div className="course-footer">
                            <span className="last-accessed">LAST ACCESSED: FEB 7</span>
                            <button className="review-btn">REVIEW MATERIAL &rarr;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LearningHistory;
