'use client';

import React, { useEffect, useState } from "react";
import { Chat } from "@/components/assistant";
import { History } from "@/components/assistant";
import { Thread, HistoryItem } from "@/types";

const Chatting: React.FC = () => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

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
    }, []);

    return (
        <section className="chatting-wrapper pt-0">
            <div className="tab-content">
                <Chat />
                <History items={historyItems} />
            </div>
        </section>
    );
};

export default Chatting;
