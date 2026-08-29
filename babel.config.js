module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      // Lets source files import from '@/...' instead of long relative paths.
      ['module-resolver', { root: ['./'], alias: { '@': './src' } }],
      // Must stay last. Reanimated is pulled in by NativeWind via
      // react-native-css-interop; as of Reanimated 4 its Babel plugin ships
      // from react-native-worklets rather than from Reanimated itself.
      'react-native-worklets/plugin',
    ],
  };
};
