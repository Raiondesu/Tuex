export type Type = 'value' | 'getter' | 'setter' | 'action' | 'global';

export type Plugin<T> = () => any;
