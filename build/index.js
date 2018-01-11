var config = require('./rollup');
var uglify = require('rollup-plugin-uglify');
var typescript = require('rollup-plugin-ts').default;
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
    if (_c.output.format !== 'umd')
      _c.uglify = require('uglify-' + _c.output.format.replace('c', '')).minify;
    return _c;
  })
).map(c => ({
  treeshake: true,

  input: c.input,
  output: {
    ...c.output,
    exports: 'named',
    name: 'Tuex',
    banner
  },


  plugins: [
    typescript({
      tsconfig: c.tsconfig,
      typescript: require('typescript')
    })
  ].concat(c.uglify ? [
    uglify({
      mangle: true,
      compress: {
        toplevel: true
      },
      output: {
        comments: 'some'
      }
    }, c.uglify)
  ] : [])
}));
