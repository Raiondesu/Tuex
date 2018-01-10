var tsc = require('typescript');
var fs = require('fs');
var version = process.env.VERSION || require('../package.json').version;

var banner = `/**
* Tuex v${version}
* (c) ${new Date().getFullYear()} Alexey Iskhakov
* @license MIT
*/

`;

var config = {
  esm: {
    uglify: require('uglify-es'),
    tsconfig: {
      target: 'esnext',
      module: 'esnext',
      outDir: './esm',
      lib: [
        'es6',
        'es2015',
        'dom'
      ]
    }
  },
  cjs: {
    uglify: require('uglify-js'),
    tsconfig: {
      target: 'es5',
      module: 'commonjs',
      outDir: './cjs',
      lib: [
        'es5',
        'es2015',
        'dom'
      ]
    }
  }
};

var tsconfig = {
  moduleResolution: 'node',
  alwaysStrict: true,
  allowSyntheticDefaultImports: true,
  experimentalDecorators: true,
  noUnusedParameters: true,
  emitDecoratorMetadata: true,
  declaration: true,
  declarationDir: './types',
  rootDir: './src',
  typeRoots: [
    '@types/jest',
    '@types/node',
    './types'
  ]
}

var tsFile = fs.readFileSync('./src/index.ts');

['cjs', 'esm'].forEach(type => {
  var path = './' + type;
  var file = banner + tsFile.toString();

  if (type === 'cjs')
    file = file.replace('export default', 'export =');

  file = tsc.transpile(file, Object.assign({}, config[type].tsconfig, tsconfig));

  (function rmRdirSync(_path) {
    if (fs.existsSync(_path)) {
      fs.readdirSync(_path).forEach(function(file, index){
        var curPath = _path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          rmRdirSync(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(_path);
    }
  }(path));
  fs.mkdirSync(path);
  fs.writeFileSync(path + '/index.js', file, { encoding: 'UTF-8' });
  fs.writeFileSync(path + '/index.min.js', config[type].uglify.minify(file).code, { encoding: 'UTF-8' });
});
