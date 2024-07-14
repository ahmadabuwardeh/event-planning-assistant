import { OpenAI as LangChainOpenAi } from "@langchain/openai";
import { BaseHandler } from './BaseHandler.ts';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ExtractKeywordsHandler extends BaseHandler {
    async handle({ message }: { message: string }): Promise<void> {
        const model = new LangChainOpenAi({
            model: "gpt-4o",
            temperature: 0.5,
            apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `The below prompt includes a user prompt, 
        as a senior keyword extractor I need you to extract the keywords from the query to visualize the most queried words by users. 
        The concern is about anything related to events, venues, or bookings.
        Keywords shall be returned in an array of objects in JSON format. Each object should have the key 'word' for the keyword and 'count' for its frequency, i.e [{"word": "book", "count": 3}, {"word": "amman", "count": 1}, {"word": "wedding", "count": 5}].
        User query: "${message}"`;

        const res = await model.invoke(prompt);

        let keywords;
        try {
            keywords = JSON.parse(res);
        } catch (error) {
            console.error('Error parsing the OpenAI response:', res, error);
            throw new Error('Failed to parse the OpenAI response');
        }

        const upsertPromises = keywords.map(async (keyword: { word: string, count: number }) => {
            const trimmedKeyword = keyword.word.trim().toLowerCase();
            return prisma.keyword.upsert({
                where: { word: trimmedKeyword },
                update: { count: { increment: keyword.count } },
                create: { word: trimmedKeyword, count: keyword.count },
            });
        });

        await Promise.all(upsertPromises);
    }
}
