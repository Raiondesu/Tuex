import { _eventPool, clearEvents, executeStoreEvent, subscribe } from '../src/events'
import { ActionCallback, GetterCallback, ValueCallback, MutationCallback, EventType, EventPool } from '../types'

describe('subscribe', () => {
  const callback: MutationCallback = (key, ...args) => {};

  var unsubscribe;

  test('pushes mutation events by default', () => {
    unsubscribe = subscribe(callback);
    expect(_eventPool.mutation).toEqual([callback]);
  })

  test('pushes other events', () => {
    subscribe('action', callback);
    expect(_eventPool.action).toEqual([callback]);

    subscribe('setter', callback);
    expect(_eventPool.setter).toEqual([callback]);

    subscribe('getter', callback);
    expect(_eventPool.getter).toEqual([callback]);

    subscribe('object', callback);
    expect(_eventPool.object).toEqual([callback]);

    subscribe('value', callback);
    expect(_eventPool.value).toEqual([callback]);
  })

  test('remembers events', () => {
    expect(_eventPool.mutation).toContain(callback);

    expect(_eventPool.value).toEqual([callback]);
    expect(_eventPool.object).toEqual([callback]);
    expect(_eventPool.getter).toEqual([callback]);
    expect(_eventPool.setter).toEqual([callback]);
    expect(_eventPool.action).toEqual([callback]);
  })

  test('unsubscribe hook works', () => {
    unsubscribe();
    expect(_eventPool.mutation).not.toContain(callback);
  })
})

describe('clearEvents', () => {
  it('clears all events', () => {
    clearEvents();

    for (let key in _eventPool)
    expect(_eventPool[key]).toEqual([]);
  })
})

describe('executeStoreEvent', () => {
  test('executes events in order', () => {
    const arr = [];
    subscribe((key, value) => (arr.push(1)));
    subscribe((key, value) => (arr.push(2)));

    executeStoreEvent('mutation');
    executeStoreEvent('mutation');

    expect(arr).toEqual([1, 2, 1, 2]);
  })
})

clearEvents();
