import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    // const supabase = createRouteHandlerClient({ cookies });
    // const { data: { session }, error } = await supabase.auth.getSession();

    // if (error) {
    //     return NextResponse.json({ error: 'Error fetching session' }, { status: 500 });
    // }
    //
    // if (!session?.user) {
    //     return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    // }

    // const userId = session.user.id;
    const userId = 'user-id-from-session'
    try {
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
