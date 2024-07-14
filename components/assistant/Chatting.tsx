'use client';

import React, { useEffect, useState } from "react";
import { Chat } from "@/components/assistant";
import { History } from "@/components/assistant";
import { Thread, HistoryItem } from "@/types";

const Chatting: React.FC = () => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [historyUpdateCount, setHistoryUpdateCount] = useState<number>(0);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const response = await fetch('/api/user/threads');
                const threads: Thread[] = await response.json();

                const items: HistoryItem[] = threads.map(thread => ({
                    id: thread.id,
                    title: thread.content,
                    details: new Date(thread.createdAt).toLocaleString(),
                }));

                setHistoryItems(items);
            } catch (error) {
                console.error('Error fetching threads:', error);
            }
        };

        fetchThreads();
    }, [historyUpdateCount]);

    return (
        <section className="flex flex-row h-screen">
            <div className="flex flex-col w-1/4 bg-gray-900 overflow-y-auto">
                <History items={historyItems} historyUpdateCount={historyUpdateCount}/>
            </div>
            <div className="flex flex-col w-3/4 p-4 bg-gray-900">
                <Chat historyUpdateCount={historyUpdateCount} setHistoryUpdateCount={setHistoryUpdateCount}/>
            </div>
        </section>
    );
};

export default Chatting;