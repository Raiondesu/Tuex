export type EventType = 'value' | 'getter' | 'setter' | 'action' | 'mutation' | 'object';
export type ActionCallback = (key: string, ...args) => void;
export type MutationCallback = (key: string, value: any) => void;
export type GetterCallback = (key: string) => void;
export type ValueCallback = (key: string, newValue?: any) => void;

export interface EventPool {
  value: ValueCallback[],
  object: ValueCallback[],
  getter: GetterCallback[],
  setter: MutationCallback[],
  action: ActionCallback[],
  mutation: MutationCallback[]
}
