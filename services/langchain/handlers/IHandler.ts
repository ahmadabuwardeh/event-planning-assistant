export interface IHandler {
    handle(params: any, socket: any): Promise<any> | void;
}

