module.exports = {
  moduleResolution: 'node',
  module: 'es2015',
  alwaysStrict: true,
  allowSyntheticDefaultImports: true,
  experimentalDecorators: true,
  noUnusedParameters: true,
  emitDecoratorMetadata: true,
  rootDir: './src',
  typeRoots: [
    '@types/jest',
    '@types/node',
    './types'
  ],
  typescript: require('typescript')
};
