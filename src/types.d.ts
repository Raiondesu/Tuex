export type Type = 'value' | 'getter' | 'setter' | 'action';

export type Plugin<T> = () => any;
