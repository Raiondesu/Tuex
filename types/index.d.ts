declare const _default: {
    new <T extends {
        [key: string]: any;
    }>(target: T | (new () => T) | (() => T), options?: {
        strict?: boolean;
        plugins?: ((this: {
            _vue: any;
            _eventPool: {
                [key: string]: ((store: T, key: keyof T, ...args: any[]) => any)[];
            };
            _storeEvent(type: "value" | "getter" | "setter" | "action" | "global", store: T, key: keyof T, ...args: any[]): void;
            _strict: boolean;
            store: T;
            subscribe(type: "value" | "getter" | "setter" | "action" | "global", callback: (store: T, key: keyof T, ...args: any[]) => any): () => void;
            replaceStore(target: T | (new () => T) | (() => T)): void;
            objectToStore(plain: T, constructor?: new () => T): T;
            install(Vue: any): void;
        }) => any)[];
    }): {
        _vue: any;
        _eventPool: {
            [key: string]: ((store: T, key: keyof T, ...args: any[]) => any)[];
        };
        _storeEvent(type: "value" | "getter" | "setter" | "action" | "global", store: T, key: keyof T, ...args: any[]): void;
        _strict: boolean;
        store: T;
        subscribe(type: "value" | "getter" | "setter" | "action" | "global", callback: (store: T, key: keyof T, ...args: any[]) => any): () => void;
        replaceStore(target: T | (new () => T) | (() => T)): void;
        objectToStore(plain: T, constructor?: new () => T): T;
        install(Vue: any): void;
    };
};
export = _default;
