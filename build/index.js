var config = require('./config');
var uglify = require('rollup-plugin-uglify');
var typescript = require('rollup-plugin-typescript');
var version = process.env.VERSION || require('../package.json').version;

var banner = `/**
* Tuex v${version}
* (c) ${new Date().getFullYear()} Alexey Iskhakov
* @license MIT
*/

`;

export default config.concat(
  config.map(c => {
    var _c = { ...c };
    _c.output = { ..._c.output };
    _c.output.file = _c.output.file.replace('.js', '.min.js');
    _c.uglify = require('uglify-' + _c.output.format.replace('c', '')).minify;
    return _c;
  })
).map(c => ({
  treeshake: true,

  input: c.input,
  output: {
    ...c.output,
    exports: 'named',
    banner
  },

  plugins: [
    typescript(c.tsconfig)
  ].concat(c.uglify ? [
    uglify({
      mangle: true
    }, c.uglify)
  ] : [])
}));
