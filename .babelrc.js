const plugins = [
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-export-default-from",
  [
    require.resolve('@babel/plugin-transform-react-jsx'),
  ],
];

const defaultEnv = {
  debug: false,
  exclude: ["@babel/plugin-transform-typeof-symbol"],
  modules: false,
  loose: true,
}

module.exports = {
  env: {
    legacy: {
      presets: [
        [
          "@babel/preset-env", {
            ...defaultEnv,
            corejs: 3,
            targets: {
              browsers: ["last 2 versions", "ie >= 11"]
            },
            useBuiltIns: 'entry',
          }
        ]
      ],
      plugins: [
        ...plugins,
        ["@babel/plugin-transform-runtime", {
          corejs: 3,
        }]
      ],
    },
    modern: {
      presets: [
        [
          "@babel/preset-env", {
            ...defaultEnv,
            corejs: 3,
            // TODO: don't copy this in production apps yet, the two last excludes need thorough testing.
            exclude: ["@babel/plugin-transform-typeof-symbol", "@babel/plugin-transform-async-to-generator", "@babel/plugin-transform-regenerator"],
            targets: { esmodules: true },
            useBuiltIns: 'usage',
          }
        ]
      ],
      plugins,
    }
  }
};
