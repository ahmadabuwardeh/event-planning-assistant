'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HistoryItem } from '@/types';

interface HistoryProps {
    items: HistoryItem[];
}

const History: React.FC<HistoryProps> = ({ items }) => {
    const router = useRouter();

    const handleClick = (id: string) => {
        router.push(`/?threadId=${id}`);
    };

    return (
        <div className="tab-pane fade show active" id="history" role="tabpanel" aria-labelledby="history" tabIndex={0}>
            <div className="main-wrapper p-0">
                <div className="fixed-header">
                    <div className="flex items-center gap-2">
                        <a href="index.html" className="logo-icon flex d-md-none">
                            <img src="/assets/svg/logo-icon.svg" className="img-fluid" />
                        </a>
                        <h3>History</h3>
                    </div>
                </div>
                <div className="main-section">
                    <div className="container card p-0">
                        <div className="card-header">
                            <h3 className="text-white">Detailed History</h3>
                        </div>
                        <div className="card-body px-sm-4 px-3">
                            <ul className="history-sec">
                                {items.map((item, index) => (
                                    <li
                                        key={index}
                                        className="history-main cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleClick(item.id)}
                                    >
                                        <div className="history-detail text-truncate flex items-center gap-2 p-2">
                                            <div>
                                                <p className="text-gray-800">{item.title}</p>
                                            </div>
                                        </div>
                                        <div className="history-time d-sm-flex d-none">
                                            <ul>
                                                <li>{item.details}</li>
                                            </ul>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
