export declare const desc: (o: any, p: string) => PropertyDescriptor;
export declare function isObject(obj: any): boolean;
export declare function isFunction(fn: any): boolean;
export declare function isPromise(value: any): boolean;
export declare function isValue(descriptor: PropertyDescriptor): boolean;
export declare function isGetter(descriptor: PropertyDescriptor): boolean;
export declare function isSetter(descriptor: PropertyDescriptor): (v: any) => void;
