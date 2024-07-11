'use client'
import React from "react";
import { Chat } from "@/components/assistant";
import { History } from "@/components/assistant";

const history = [
    {
        title: 'What is app development?',
        details: '2 min ago',
    },
    {
        title: 'Dino has sent you message.',
        details: '50 min ago',
    },
];


const Chatting: React.FC = () => {
    return (
        <section className="chatting-wrapper pt-0">
            <div className="tab-content">
                <Chat />
                <History items={history} />
            </div>
        </section>
    );
};

export default Chatting;
