import { EventType, EventPool, ActionCallback, ValueCallback, GetterCallback, MutationCallback } from "../types";

export let _eventPool: EventPool = {
  value: [],
  object: [],
  getter: [],
  setter: [],
  action: [],
  mutation: []
}

/**
 * Executes store callbacks in order they were registered
 *
 * @param {'value' | 'object' | 'getter' | 'setter' | 'action' | 'mutation'} type
 * @param {string} key
 */
export function executeStoreEvent(type: EventType, key?: string, ...args) {
  for (var i = 0; i < _eventPool[type].length; i++)
    _eventPool[type][i](key, ...args);
}

/**
 * Subscribe for the store mutation event.
 * Callback is executed BEFORE the event!
 *
 * @param callback
 * @returns a funciton to unsubscribe from event
 */
export function subscribe(callback: MutationCallback): () => void;

/**
 * Subscribe for store events.
 * Callback is executed BEFORE the event!
 *
 * @param {'value' | 'object' | 'getter' | 'setter' | 'action' | 'mutation'} type
 * @param callback
 * @returns a funciton to unsubscribe from event
 */
export function subscribe(type: EventType, callback: MutationCallback | ActionCallback | ValueCallback | GetterCallback): () => void;

export function subscribe() {
  if (typeof arguments[0] === 'string') {
    var type = arguments[0];
    var callback = arguments[1];
  } else {
    type = 'mutation';
    callback = arguments[0];
  }

  _eventPool[type].push(callback);
  return () => {
    _eventPool[type] = [..._eventPool[type].filter(c => c != callback)];
  }
}

/**
 * Clears all callbacks from store events list
 */
export function clearEvents() {
  for (let type in _eventPool) {
    _eventPool[type].splice(0);
  }
}
