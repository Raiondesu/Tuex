export type Type = 'value' | 'getter' | 'setter' | 'action';

export type Plugin<T> = (state: T, options: {
	subscribe: (type: Type, callback: (store: T, key: keyof T) => any) => void,
	replaceStore: (store: T) => void
}) => any;