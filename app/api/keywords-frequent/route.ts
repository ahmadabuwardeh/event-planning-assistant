import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const keywords = await prisma.keyword.findMany({
            select: {
                word: true,
                count: true,
            },
            orderBy: {
                count: 'desc',
            },
            take: 50,
        });

        if (!keywords || keywords.length === 0) {
            return NextResponse.json({ error: 'No keywords found' }, { status: 404 });
        }

        const formattedKeywords = keywords.map(keyword => ({
            word: keyword.word,
            count: keyword.count,
        }));

        return NextResponse.json(formattedKeywords, { status: 200 });
    } catch (error) {
        console.error('Error fetching keywords:', error);
        return NextResponse.json({ error: 'Failed to fetch keywords' }, { status: 500 });
    }
}
