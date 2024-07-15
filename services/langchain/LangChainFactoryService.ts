import { CreateThreadHandler } from './handlers/CreateThreadHandler.ts';
import { AddMessageHandler } from './handlers/AddMessageHandler.ts';
import { PollThreadStatusHandler } from './handlers/PollThreadStatusHandler.ts';
import { ExtractKeywordsHandler } from './handlers/ExtractKeywordsHandler.ts';
import { LangChainService } from './LangChainService.ts';

export const CreateLangChainService = () => {
    const createThreadHandler = new CreateThreadHandler();
    const addMessageHandler = new AddMessageHandler();
    const pollThreadStatusHandler = new PollThreadStatusHandler();
    const extractKeywordsHandler = new ExtractKeywordsHandler();

    return new LangChainService(
        createThreadHandler,
        addMessageHandler,
        pollThreadStatusHandler,
        extractKeywordsHandler,
    );
};
