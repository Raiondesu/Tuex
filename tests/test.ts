import { isObject } from '../src/misc'

describe('test', () => {
  it('tests', () => {
    expect(isObject({})).toBe(true);
  })
})
