'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { BiMenu } from 'react-icons/bi';
import { ChatBubble, Form } from '@/components/assistant';
import { Message } from '@/types';
import { socket } from "@/socket";

const Chat: React.FC = () => {
    const [active, setActive] = useState<string>('Ask anything');
    const [hide, setHide] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const close = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setHide(false);
    };

    const handleSendMessage = (e: FormEvent<HTMLFormElement>, callback: () => void) => {
        e.preventDefault();
        const prompt = (e.target as HTMLFormElement).prompt.value;
        if (prompt.trim()) {
            const newMessage = { role: 'user', content: prompt };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit("message1", prompt);
            callback();
        }
    };

    useEffect(() => {
        if (messages && messages.length && hide) setHide(false);

        return () => {
            socket.off("message1");
        };
    }, [messages, hide]);

    if (loading) return <h2 className="bg-white">Loading...</h2>;

    return (
        <div className="tab-pane fade show active" id="chat" role="tabpanel" aria-labelledby="chat" tabIndex={0}>
            <div className="main-wrapper">
                <nav className="navbar navbar-expand-lg bg-light p-0">
                    <button
                        className="navbar-toggler d-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <BiMenu className="text-xl text-green-500" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <div className="inner-menu-panel">
                            <button
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarNav"
                                className="inner-close d-block d-lg-none"
                            >
                                Back
                            </button>
                            <div className="search-box">
                                <i className="iconsax" data-icon="search-normal-2"></i>
                                <input type="text" className="form-control" placeholder="Search here.." />
                            </div>
                            <ul className="inner-links-list" id="innerLink">
                                {/* Add list items here */}
                            </ul>
                        </div>
                    </div>
                </nav>
                <header className="chat-header">
                    <div className="flex items-center gap-2">
                        <button
                            className="navbar-toggler d-md-none d-block"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#mainnavbarNav"
                            aria-controls="mainnavbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <BiMenu className="text-xl text-green-500" />
                        </button>
                        <a href="index.html" className="logo-icon flex d-md-none">
                            <img src="/assets/svg/logo-icon.svg" className="img-fluid" />
                        </a>
                        <h3 id="targetDiv">{active}</h3>
                    </div>
                </header>
                <div className="main-chat">
                    {hide ? (
                        <div className="no-chat">
                            <div>
                                <img src="/assets/svg/no-chat.svg" className="img-fluid" alt="" />
                                <h3>
                                    {active === 'Ask anything' ? '' : 'Ask'} {active} chatbot
                                </h3>
                            </div>
                        </div>
                    ) : (
                        <div id="chat_container" className="flex-1 ml-4 flex flex-col gap-2 pb-12 h-[75vh] overflow-y-scroll">
                            {messages.map((itm, index) => (
                                <ChatBubble key={index} role={itm.role} content={itm.content} />
                            ))}
                        </div>
                    )}
                    <Form handleSendMessage={handleSendMessage} setMessages={setMessages} close={close} />
                </div>
            </div>
        </div>
    );
};

export default Chat;
