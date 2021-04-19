export type NormalEventHandler<T> = (event: T) => void;

export class NormalEvent<T> {
    private _handlers: NormalEventHandler<T>[];

    public constructor() {
        this._handlers = [];
    }

    subscribe(handler: NormalEventHandler<T>): void {
        this._handlers.push(handler);
    }

    unsubscribe(handler: NormalEventHandler<T>): void {
        for (let i = 0; i < this._handlers.length; i++) {
            if (this._handlers[i] === handler) {
                this._handlers.splice(i, 1);
            }
        }
    }
}