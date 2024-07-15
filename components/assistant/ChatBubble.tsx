'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatBubbleProps } from "@/types";

export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content }) => {
    const bubbleStyles = role === 'assistant'
        ? 'bg-white text-black self-end mr-3'
        : 'bg-emerald-900 text-white';

    return (
        <div className={`chat-bubble rounded-lg p-2 mb-2 max-w-md break-words ${bubbleStyles}`}>
            <ReactMarkdown className="chat-bubble__text">{content}</ReactMarkdown>
        </div>
    );
};
