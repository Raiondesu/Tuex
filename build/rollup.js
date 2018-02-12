const srcDir = './src/';
const outDir = './lib/';

module.exports = [
  {
    input: srcDir + 'index.cjs.ts',

    output: {
      file: outDir + 'index.js',
      format: 'cjs',
    },

    tsconfig: {
      ...require('./tsconfig'),
      target: 'es5',
      outDir: outDir + 'cjs',
      module: 'commonjs',
      lib: [
        'es5',
        'es2015',
        'dom'
      ]
    }
  },
  {
    input: srcDir + 'index.cjs.ts',

    output: {
      file: outDir + 'umd/index.js',
      format: 'umd',
    },

    tsconfig: {
      ...require('./tsconfig'),
      target: 'es5',
      outDir: outDir + 'umd',
      module: 'umd',
      lib: [
        'es5',
        'es2015',
        'dom'
      ]
    }
  },
  {
    input: srcDir + 'index.ts',

    output: {
      file: outDir + 'esm/index.js',
      format: 'es',
    },

    tsconfig: {
      ...require('./tsconfig'),
      target: 'esnext',
      outDir: outDir + 'esm',
      module: 'es2015',
      lib: [
        'es5',
        'es6',
        'es2015',
        'dom'
      ]
    }
  },
]
