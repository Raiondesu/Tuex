import { VueConstructor } from "vue/types/vue";
export declare type EventType = 'value' | 'getter' | 'setter' | 'action' | 'global';
/**
 *
 *
 * @class Tuex
 * @template T
 */
export default class Tuex<T extends {
    [key: string]: any;
}> {
    private vue;
    private eventPool;
    private storeEvent(type, store, key, ...args);
    /**
     * Creates an instance of Tuex.
     * @param {((new () => T) | (() => T) | T)} target - can be a plain object, function that returns an object or a constructor function (class)
     * @param {Plugin<T>[]} plugins - optional plugins to install
     * @memberof Store
     */
    constructor(target: T | (new () => T) | (() => T), options: {
        strict?: boolean;
        plugins?: ((this: Tuex<T>) => any)[];
    });
    store: T;
    /**
     *
     *
     * @param {'value' | 'getter' | 'setter' | 'action' | 'global'} type
     * @param {(store: T, key: keyof T) => any} callback
     * @returns a funciton to unsubscribe from event
     * @memberof Tuex
     */
    subscribe(type: EventType, callback: (store: T, key: keyof T, ...args) => any): () => void;
    /** replaceStore
     *
     * A function that replaces the current store with the other one,
     * converting it from a target object/function/constructor
     *
     * @param {(T | (new () => T) | (() => T))} target
     * @memberof Tuex
     */
    replaceStore(target: T | (new () => T) | (() => T), makeImmutable?: boolean): void;
    /** objectToStore
     *
     * Converts a plain js object into a valid Tuex-store
     *
     * TODO: make recursive for object values
     *
     * @param {T} plain - object to convert
     * @param {new () => T} [constructor] - constructor (if any)
     * @returns {T} - converted store
     * @memberof Tuex
     */
    objectToStore(plain: T, constructor?: new () => T, immutableState?: boolean): T;
    install(Vue: VueConstructor): void;
}
