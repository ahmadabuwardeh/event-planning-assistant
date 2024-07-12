'use client';

import React from 'react';
import { ChatBubbleProps } from "@/types";

export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content }) => {
    const bubbleStyles = role === 'assistant'
        ? 'bg-white text-black self-end mr-3'
        : 'bg-green-500 text-white';
    return (
        <div className={`chat-bubble rounded-lg p-2 mb-2 max-w-md break-words ${bubbleStyles}`}>
            <p className="chat-bubble__text">{content}</p>
        </div>
    );
};
