import {CreateThreadHandler} from './handlers/CreateThreadHandler.ts';
import {AddMessageHandler} from './handlers/AddMessageHandler.ts';
import {PollThreadStatusHandler} from './handlers/PollThreadStatusHandler.ts';
import {LangChainService} from './LangChainService.ts';

export const createLangChainService = () => {
    const createThreadHandler = new CreateThreadHandler();
    const addMessageHandler = new AddMessageHandler();
    const pollThreadStatusHandler = new PollThreadStatusHandler();

    return new LangChainService(
        createThreadHandler,
        addMessageHandler,
        pollThreadStatusHandler,
    );
};