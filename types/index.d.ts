export type EventType = 'value' | 'getter' | 'setter' | 'action' | 'global';

export declare class Tuex<T extends { [key: string]: any }> {
  private _vue;
  private __store: { state: T }
  private _strict: boolean = false;
  private _setVueProtoStore(store: T);
	private _storeEvent(type: EventType, store: T, key: keyof T, ...args);
  private _eventPool: { [key: string]: ((store: T, key: keyof T, ...args) => any)[] };

  private install(Vue);

  constructor(
    target: T | (new () => T) | (() => T),
    options?: {
      strict?: boolean,
      plugins?: ((this: Tuex<T>) => any)[],
    }
  );

  public get store(): T;
  public set store(value: T);

  public subscribe(type: EventType, callback: (store: T, key: keyof T, ...args) => any);
  public replaceStore(target: T | (new () => T) | (() => T));
  public objectToStore(plain: T, constructor?: new () => T): T;
}

