import {
  fromPath,
  desc,
  isFunction,
  isGetter,
  isObject,
  isSetter,
  isValue,
  error,
  keysOf
} from 'tuex/src/misc'

describe('fromPath', () => {
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

  test('returns object from empty path', () => expect(fromPath(obj, '')).toBe(obj))

  test('returns property from path', () => {
    expect(fromPath(obj, 'bar')).toBe(obj.bar);
    expect(fromPath(obj, 'bar')).toBe('foo');
  })

  test('returns nested property from dotted path', () => {
    expect(fromPath(obj, 'foo.bar')).toBe(obj.foo.bar);
    expect(fromPath(obj, 'foo.bar')).toBe('baz');

    expect(fromPath(obj, 'complex.nested.path.you.never.asked.for')).toBe(obj.complex.nested.path.you.never.asked.for);
    expect(fromPath(obj, 'complex.nested.path.you.never.asked.for')).toBe('I never asked for this!');
  })

  test('returns first match for wrong path', () => {
    expect(fromPath(obj, 'complex.nested.path.you.always.asked.for')).toBe('haha, no');
    expect(fromPath(obj, 'complex.nested.path.you.aaaalways.asked.for')).toBe(obj.complex.nested.path.you);
  })

  test('returns nested property from system-like path', () => {
    expect(fromPath(obj, 'foo/bar')).toBe(obj.foo.bar);
    expect(fromPath(obj, 'foo/bar')).toBe('baz');

    expect(fromPath(obj, 'complex/nested/path/you/never/asked/for')).toBe(obj.complex.nested.path.you.never.asked.for);
    expect(fromPath(obj, 'complex/nested/path/you/never/asked/for')).toBe('I never asked for this!');
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

    expect(isObject({ value: obj })).toBe(true);
    expect(isObject({ value: new Obj() })).toBe(true);
    expect(isObject({ value: new Obj })).toBe(true);
  })

  test('returns false for everything else', () => {
    function f() {}
    const number = 2;
    const string = 'dsa';
    const boolean = false;
    const _null = null;
    const _undefined = undefined;
    class Obj {}

    expect(isObject({ value: Obj })).toBe(false);
    expect(isObject({ value: f })).toBe(false);
    expect(isObject({ value: () => {} })).toBe(false);
    expect(isObject({ get: () => {} })).toBe(false);
    expect(isObject({ value: number })).toBe(false);
    expect(isObject({ value: string })).toBe(false);
    expect(isObject({ value: boolean })).toBe(false);
    expect(isObject({ value: _null })).toBe(false);
    expect(isObject({ value: _undefined })).toBe(false);
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
