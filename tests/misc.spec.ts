import {
  pathValue,
  desc,
  isFunction,
  isGetter,
  isObject,
  isSetter,
  isValue,
  error,
  keysOf
} from '../src/misc'

describe('pathValue', () => {
  const obj = {
    bar: 'foo',
    foo: {
      bar: 'baz'
    },
    complex: {
      nested: {
        path: {
          you: {
            always: 'haha, no',
            never: {
              asked: {
                for: 'I never asked for this!'
              }
            }
          }
        }
      }
    }
  }

  test('returns object from empty path', () => expect(pathValue(obj, '')).toBe(obj))

  test('returns property from path', () => {
    expect(pathValue(obj, 'bar')).toBe(obj.bar);
    expect(pathValue(obj, 'bar')).toBe('foo');
  })

  test('returns nested property from dotted path', () => {
    expect(pathValue(obj, 'foo.bar')).toBe(obj.foo.bar);
    expect(pathValue(obj, 'foo.bar')).toBe('baz');

    expect(pathValue(obj, 'complex.nested.path.you.never.asked.for')).toBe(obj.complex.nested.path.you.never.asked.for);
    expect(pathValue(obj, 'complex.nested.path.you.never.asked.for')).toBe('I never asked for this!');
  })

  test('returns undefined for wrong path', () => {
    expect(pathValue(obj, 'complex.nested.path.you.always.asked.for')).toBe(undefined);
    expect(pathValue(obj, 'complex.nested.path.you.aaaalways.asked.for')).toBe(undefined);
  })

  test('returns nested property from system-like path', () => {
    expect(pathValue(obj, 'foo/bar')).toBe(obj.foo.bar);
    expect(pathValue(obj, 'foo/bar')).toBe('baz');

    expect(pathValue(obj, 'complex/nested/path/you/never/asked/for')).toBe(obj.complex.nested.path.you.never.asked.for);
    expect(pathValue(obj, 'complex/nested/path/you/never/asked/for')).toBe('I never asked for this!');
  })

  test('assigns to existing path', () => {
    const obj = {
      path: {
        nested: {
          v: 2
        }
      }
    };

    pathValue(obj, ['path', 'nested', 'v'], -1);

    expect(obj.path.nested.v).toBe(-1);
  })

  test('assigns to inexisting path', () => {
    const obj: any = {};

    pathValue(obj, 'path.nested.v', -1);
    expect(obj.path.nested.v).toBe(-1);

    pathValue(obj, 'path.nested.v.a', -10);
    expect(obj.path.nested.v.a).toBe(-10);
  })

  test('assigns to empty path', () => {
    let obj: any = {};

    obj = pathValue(obj, '', { key: 2 });
    expect(obj.key).toBe(2);
  })

  test('assigns to wrong paths', () => {
    let obj: any = {};

    obj = pathValue(obj, 'path.nested..a', -1);
    expect(obj.path.nested).toBe(-1);

    obj = pathValue(obj, 'path.nested.v.a', -10);
    expect(obj.path.nested.v.a).toBe(-10);
  })
})

describe('isFunction', () => {
  test('returns true for functions', () => {
    function f() {}

    expect(isFunction({ value: f })).toBe(true);
    expect(isFunction({ value: () => {} })).toBe(true);

    class Obj {}

    expect(isFunction({ value: Obj })).toBe(true);
  })

  test('returns false for everything else', () => {
    const number = 2;
    const string = 'dsa';
    const boolean = false;
    const _null = null;
    const _undefined = undefined;
    const obj = {};
    class Obj {}


    expect(isFunction({ value: new Obj })).toBe(false);
    expect(isFunction({ value: new Obj() })).toBe(false);
    expect(isFunction({ get: () => {} })).toBe(false);
    expect(isFunction({ value: number })).toBe(false);
    expect(isFunction({ value: string })).toBe(false);
    expect(isFunction({ value: boolean })).toBe(false);
    expect(isFunction({ value: _null })).toBe(false);
    expect(isFunction({ value: _undefined })).toBe(false);
    expect(isFunction({ value: obj })).toBe(false);
  })
})

describe('isObject', () => {
  test('returns true for objects', () => {
    const obj = {};
    class Obj {}

    expect(isObject(obj)).toBe(true);
    expect(isObject(new Obj())).toBe(true);
    expect(isObject(new Obj)).toBe(true);
  })

  test('returns false for everything else', () => {
    function f() {}
    const number = 2;
    const string = 'dsa';
    const boolean = false;
    const _null = null;
    const _undefined = undefined;
    class Obj {}

    expect(isObject(Obj)).toBe(false);
    expect(isObject(f)).toBe(false);
    expect(isObject(() => {})).toBe(false);
    expect(isObject(number)).toBe(false);
    expect(isObject(string)).toBe(false);
    expect(isObject(boolean)).toBe(false);
    expect(isObject(_null)).toBe(false);
    expect(isObject(_undefined)).toBe(false);
  })
})

describe('isValue', () => {
  test('returns true for values', () => {
    let number = 2;
    const string = 'dsa';
    const boolean = false;
    const _null = null;
    const obj = {
      get x() { return number; },
      set x(v) { number = v; }
    };
    class Obj {}
    const _undefined = undefined;

    expect(isValue({ value: number })).toBe(true);
    expect(isValue({ value: string })).toBe(true);
    expect(isValue({ value: boolean })).toBe(true);
    expect(isValue({ value: _null })).toBe(true);
    expect(isValue({ value: obj })).toBe(true);
    expect(isValue({ value: obj.x })).toBe(true);
    expect(isValue({ value: new Obj() })).toBe(true);
    expect(isValue({ value: new Obj })).toBe(true); // Prototype!
    expect(isValue({ value: _undefined })).toBe(true);
  })

  test('returns false for everything else', () => {
    function f() {}
    class Obj {}

    expect(isValue({ value: Obj })).toBe(false);
    expect(isValue({ value: f })).toBe(false);
    expect(isValue({ value: () => {} })).toBe(false);
    expect(isValue({ get: () => {} })).toBe(false);
  })
})

describe('error', () => {
  const backup = console.error;

  const errorText = 'this is an error';
  const tuexPrefix = '[Tuex warn] ';

  test('outputs in "development" mode', () => {
    console.error = (...args) => args;

    process.env.NODE_ENV = 'development';
    expect(error(errorText)).toEqual([tuexPrefix + errorText]);

    console.error = backup;
  })

  test('doesn\'t output in "production" mode', () => {
    console.error = (...args) => args;

    process.env.NODE_ENV = 'production';
    expect(error(errorText)).toEqual(undefined);

    console.error = backup;
  })

})

describe('isGetter', () => {
  test('returns true for getters', () => {
    const obj = {
      get test() { return 'test'; }
    }

    expect(isGetter(desc(obj, 'test'))).toBe(true);
  })

  test('returns false for everything else', () => {
    const obj = {
      set test(value) { },
      x: 12,
      y: {},
      f() {}
    }

    expect(isGetter(desc(obj, 'test'))).toBe(false);
    expect(isGetter(desc(obj, 'x'))).toBe(false);
    expect(isGetter(desc(obj, 'y'))).toBe(false);
    expect(isGetter(desc(obj, 'f'))).toBe(false);
  })
})

describe('isSetter', () => {
  test('returns true for Setters', () => {
    const obj = {
      set test(value) { },
    }

    expect(isSetter(desc(obj, 'test'))).toBe(true);
  })

  test('returns false for everything else', () => {
    const obj = {
      get test() { return 'test'; },
      x: 12,
      y: {},
      f() {}
    }

    expect(isSetter(desc(obj, 'test'))).toBe(false);
    expect(isSetter(desc(obj, 'x'))).toBe(false);
    expect(isSetter(desc(obj, 'y'))).toBe(false);
    expect(isSetter(desc(obj, 'f'))).toBe(false);
  })
})

describe('keysOf', () => {
  test('returns enumerable keys', () => {
    const obj = {
      x: 2,
      y: 'asd'
    }

    expect(keysOf(obj)).toEqual(Object.keys(obj));
  })

  test('returns non-enumerable keys', () => {
    const obj = {
      x() {},
      get y() { return 'asd'; },
      set y(v) {}
    }

    obj['prototype'] = {
      a: 'sd'
    }

    expect(keysOf(obj)).toEqual(Object.getOwnPropertyNames(obj));
  })
})
