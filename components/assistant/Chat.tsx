'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatBubble, Form } from '@/components/assistant';
import {HistoryItem, Message} from '@/types';
import { socket } from "@/socket";
import { supabase } from "@/lib/supabaseClient";

interface ChatProps {
    setHistoryUpdateCount: (count: number) => void;
    historyUpdateCount: number
}


const Chat: React.FC<ChatProps> = ({ setHistoryUpdateCount, historyUpdateCount }) => {
    const [active, setActive] = useState<string>('Ask anything');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const threadId = searchParams.get('threadId');

    const handleNewChat = () => {
        setMessages([]);
        setLoading(true);
        setHistoryUpdateCount( historyUpdateCount + 1); // Correct type for setState
        router.push('/');
    };

    useEffect(() => {
        const fetchUserId = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error fetching session:', error);
            } else {
                setUserId(data.session?.user?.id || null);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchMessages = async (threadId: string) => {
            try {
                const response = await fetch(`/api/assistant/?threadId=${threadId}`);
                const data = await response.json();

                const parsedData = []
                for (const item of data) {
                    const messageObj = {
                        role: item.role,
                        content: JSON.parse(item.content)[0].text.value,
                    }
                    parsedData.push(messageObj);
                }
                if (response.ok) {
                    setMessages(parsedData);
                } else {
                    console.error('Error fetching messages:', data.error);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        if (threadId) {
            fetchMessages(threadId);
        } else {
            setLoading(false);
        }
    }, [threadId]);

    const handleSendMessage = (e: FormEvent<HTMLFormElement>, callback: () => void) => {
        e.preventDefault();
        const prompt = (e.target as HTMLFormElement).prompt.value;
        if (prompt.trim() && userId) {
            const newMessage = { role: 'user', content: prompt };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit("start_stream", { message: prompt, threadId: threadId || undefined, userId });
            callback();
        }
    };

    useEffect(() => {
        socket.on('textDelta', (data: any) => {
            setMessages((prevMessages) => {
                const lastMessage = prevMessages[prevMessages.length - 1];
                return [...prevMessages.slice(0, prevMessages.length - 1), { ...lastMessage, content: lastMessage.content + data.value }];
            });
        });

        socket.on('textCreated', () => {
            setMessages((prevState: Message[]) => {
                return [...prevState, { role: 'assistant', content: '' }];
            });
        });

        socket.on('stream_end', () => {
            console.log('Stream ended');
        });

        socket.on('thread_created', (data: { threadId: string }) => {
            router.push(`/?threadId=${data.threadId}`);
        });

        socket.on('error', (error: string) => {
            console.error('Socket error:', error);
        });

        return () => {
            socket.off('stream_data');
            socket.off('stream_end');
            socket.off('error');
            socket.off('textDelta');
            socket.off('textCreated');
            socket.off('thread_created');
        };
    }, []);

    if (loading) return <h2 className="bg-white">Loading...</h2>;

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 bg-gray-800 shadow">
                <h3>{active}</h3>
                <button onClick={handleNewChat} className="rounded outline hover:bg-gray-700 px-2 py-1">
                    New Chat
                </button>
            </header>
            <div className="flex-1 flex flex-col gap-2 pt-4 px-4 pb-20 overflow-y-auto">
                {messages.map((itm, index) => (
                    <ChatBubble key={index} role={itm.role} content={itm.content} />
                ))}
            </div>
            <Form handleSendMessage={handleSendMessage} setMessages={setMessages} />
        </div>
    );
};

export default Chat;
