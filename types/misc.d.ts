export declare const desc: {
    (o: any, propertyKey: PropertyKey): PropertyDescriptor;
    (o: any, p: string): PropertyDescriptor;
};
export declare const keysOf: (o: any) => string[];
export declare const isObject: (obj: any) => boolean;
export declare const isFunction: (fn: any) => boolean;
export declare const isPromise: (value: any) => boolean;
export declare const isValue: (descriptor: PropertyDescriptor) => boolean;
export declare const isGetter: (descriptor: PropertyDescriptor) => boolean;
export declare const isSetter: (descriptor: PropertyDescriptor) => (v: any) => void;
export declare const error: (message: any) => void;
