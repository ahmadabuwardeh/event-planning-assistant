import { IHandler } from './IHandler.ts';

export abstract class BaseHandler implements IHandler {
    abstract handle(params: any, socket: any): Promise<any>;
}
