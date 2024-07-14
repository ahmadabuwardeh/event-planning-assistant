'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HistoryItem } from '@/types';

interface HistoryProps {
    items: HistoryItem[];
    historyUpdateCount: number;

}

const History: React.FC<HistoryProps> = ({ items, historyUpdateCount }) => {
    const router = useRouter();

    const handleClick = (id: string) => {
        router.push(`/?threadId=${id}`);
    };

    const handleVisualize = () => {
        console.log('hello')
    }

    return (
        <div className="flex flex-col h-full p-4 bg-gray-800">
            <header className="flex items-center gap-2 mb-4 justify-between">
                <h3>History</h3>
                <button onClick={handleVisualize} className="rounded outline hover:bg-gray-700 px-2 py-1">
                    Visualize
                </button>
            </header>
            <div className="flex-1 overflow-y-auto">
                <div className="bg-gray-900 shadow rounded-lg">
                    <div className="p-4">
                        <h3 className="text-gray-200 font-bold mb-4">Detailed History</h3>
                        <ul className="space-y-2">
                            {items.map((item, index) => (
                                <li
                                    key={index}
                                    className="p-2 bg-gray-700 hover:bg-gray-800 rounded cursor-pointer"
                                    onClick={() => handleClick(item.id)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="text-gray-100">{item.title}</div>
                                        <div className="text-sm text-gray-500">{item.details}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;