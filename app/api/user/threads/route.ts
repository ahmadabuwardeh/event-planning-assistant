import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCookie } from 'cookies-next';
import { AuthSession } from '@supabase/supabase-js';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const sessionCookie = getCookie('supabase', { req: request });

        if (!sessionCookie) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        const session = JSON.parse(sessionCookie as string) as AuthSession;

        if (!session?.user) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        const userId = session.user.id;

        const threads = await prisma.thread.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(threads, { status: 200 });
    } catch (error) {
        console.error('Error retrieving threads:', error);
        return NextResponse.json({ error: 'Failed to retrieve threads' }, { status: 500 });
    }
}
