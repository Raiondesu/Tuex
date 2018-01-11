module.exports = {
  moduleResolution: 'node',
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
};
