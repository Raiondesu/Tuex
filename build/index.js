var tsc = require('typescript');
var fs = require('fs');
var uglifyjs = require('uglify-js');
var uglifyes = require('uglify-es');

var version = process.env.VERSION || require('../package.json').version;

var banner = `/**
* Tuex v${version}
* (c) ${new Date().getFullYear()} Alexey Iskhakov
* @license MIT
*/

`;

var tsFile = fs.readFileSync('./src/index.ts');
// fs.writeFileSync('./src/index.ts', banner + tsFile.toString(), { encoding: 'UTF-8' });

var jsFile = tsc.transpile((banner + tsFile.toString()).replace('export default', 'export ='), require('../tsconfig.json'));
var esFile = tsc.transpile(banner + tsFile.toString(), require('../tsconfig.esm.json'));

fs.rmdirRSync = function rmdirRSync(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        rmdirRSync(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

fs.rmdirRSync('./esm');
fs.rmdirRSync('./cjs');
fs.mkdirSync('./esm');
fs.mkdirSync('./cjs');
fs.writeFileSync('./cjs/index.js', jsFile, { encoding: 'UTF-8' });
fs.writeFileSync('./esm/index.js', esFile, { encoding: 'UTF-8' });

// jsFile = uglifyjs.Compressor(jsFile);
// jsFile.mangle_names();
jsFile = uglifyjs.minify(jsFile).code;

fs.writeFileSync('./cjs/index.min.js', jsFile, { encoding: 'UTF-8' });

// tsFile = uglifyes.Compressor(tsFile);
// tsFile.mangle_names();
tsFile = uglifyes.minify(esFile).code;

fs.writeFileSync('./esm/index.min.js', tsFile, { encoding: 'UTF-8' });
