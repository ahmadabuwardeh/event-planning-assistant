'use client';

import React, { useState } from "react";
import { Chat } from "@/components/assistant";
import { History } from "@/components/assistant";
import { HistoryItem } from "@/types";

interface ChattingProps {
    initialHistoryItems: HistoryItem[];
}

const Chatting: React.FC<ChattingProps> = ({ initialHistoryItems }) => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>(initialHistoryItems);
    const [historyUpdateCount, setHistoryUpdateCount] = useState<number>(0);

    return (
        <section className="flex flex-row h-screen">
            <div className="flex flex-col w-1/4 bg-gray-900 overflow-y-auto">
                <History items={historyItems} historyUpdateCount={historyUpdateCount} />
            </div>
            <div className="flex flex-col w-3/4 p-4 bg-gray-900">
                <Chat historyUpdateCount={historyUpdateCount} setHistoryUpdateCount={setHistoryUpdateCount} />
            </div>
        </section>
    );
};

export default Chatting;
