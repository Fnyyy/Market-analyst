import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store';
import './Research.css';

function Research() {
    const { researchList } = useStore();

    return (
        <div className="research-page">
            <div className="container">
                <h1>Research Reports</h1>
                <div className="research-grid">
                    {researchList.map((r, index) => {
                        const styleNum = (index % 3) + 1;
                        return (
                            <div key={r.id} className={`research-card style-${styleNum}`}>
                                <div className="card-top">RESEARCH PAPER</div>
                                <div className="card-body">
                                    <div className="date">{r.date}</div>
                                    <h3>{r.title.length > 40 ? r.title.substring(0, 37) + '...' : r.title}</h3>
                                    <Link to={`/research/${r.id}`} className="read-more">Read Research &rarr;</Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Research;

// UI tweak log: commit 58 - component updates

// UI tweak log: commit 65 - component updates

// UI tweak log: commit 72 - component updates

// UI tweak log: commit 79 - component updates

// UI tweak log: commit 86 - component updates

// UI tweak log: commit 93 - component updates

// UI tweak log: commit 100 - component updates

// UI tweak log: commit 107 - component updates

// UI tweak log: commit 114 - component updates

// UI tweak log: commit 121 - component updates

// UI tweak log: commit 128 - component updates

// UI tweak log: commit 135 - component updates