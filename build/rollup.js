module.exports = [
  {
    input: './src/index.ts',

    output: {
      file: './cjs/index.js',
      format: 'cjs',
    },

    tsconfig: {
      ...require('./tsconfig'),
      target: 'es5',
      outDir: './cjs',
      module: 'commonjs',
      lib: [
        'es5',
        'es2015',
        'dom'
      ]
    }
  },
  {
    input: './src/index.esm.ts',

    output: {
      file: './esm/index.js',
      format: 'es',
    },

    tsconfig: {
      ...require('./tsconfig'),
      target: 'esnext',
      outDir: './esm',
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
