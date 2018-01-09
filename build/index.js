var tsc = require('typescript');
var fs = require('fs');
var version = process.env.VERSION || require('../package.json').version;

var banner = `/**
* Tuex v${version}
* (c) ${new Date().getFullYear()} Alexey Iskhakov
* @license MIT
*/

`;

var uglify = {
  cjs: require('uglify-js'),
  esm: require('uglify-es')
};

var config = {
  esm: {
    target: 'esnext',
    module: 'esnext',
    outDir: './esm',
    lib: [
      'es6',
      'es2015',
      'dom'
    ]
  },
  cjs: {
    target: 'es5',
    module: 'commonjs',
    outDir: './cjs',
    lib: [
      'es5',
      'es2015',
      'dom'
    ]
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
  var file = banner + tsFile.toString();

  if (type === 'cjs')
    file = file.replace('export default', 'export =');

  file = tsc.transpile(file, Object.assign({}, config[type], tsconfig));

  function rmRdirSync(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          rmRdirSync(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };

  rmRdirSync('./' + type);
  fs.mkdirSync('./' + type);
  fs.writeFileSync('./' + type + '/index.js', file, { encoding: 'UTF-8' });

  file = uglify[type].minify(file).code;

  fs.writeFileSync('./' + type + '/index.min.js', file, { encoding: 'UTF-8' });
});
