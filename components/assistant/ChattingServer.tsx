import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import React from 'react';
import dynamic from 'next/dynamic';
import { supabase } from "@/lib/supabaseClient";
import { HistoryItem, Thread } from "@/types";

const prisma = new PrismaClient();
const Chatting = dynamic(() => import('@/components/assistant/Chatting'), { ssr: false });


async function fetchThreads(userId: string): Promise<HistoryItem[]> {
    const threads: Thread[] = await prisma.thread.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    return threads.map((thread: Thread) => ({
        id: thread.id,
        title: thread.content,
        details: new Date(thread.createdAt).toLocaleString(),
    }));
}

const ChattingServer = async () => {
    const cookieStore = cookies();
    const session = cookieStore.get('supabase');
    if (!session) {
        throw new Error('User not authenticated');
    }

    let userId = null;
    try {
        const access_token = JSON.parse(session.value).access_token;
        const { data: { user }, error } = await supabase.auth.getUser(access_token);

        if (error) {
            throw new Error('Failed to fetch user');
        }

        userId = user?.id;
    } catch (error) {
        console.error('Error parsing session or fetching user:', error);
        throw new Error('User not authenticated');
    }

    if (!userId) {
        throw new Error('User not authenticated');
    }

    const historyItems = await fetchThreads(userId);

    return <Chatting initialHistoryItems={historyItems} />;
};

export default ChattingServer;
