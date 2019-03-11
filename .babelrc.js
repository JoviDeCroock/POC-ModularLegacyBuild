const plugins = [
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-export-default-from"
]

module.exports = {
  env: {
    legacy: {
      presets: [
        ["@babel/preset-react", { useBuiltIns: true }],
        [
          "@babel/preset-env", {
            modules: false,
            targets: ['ie 9'],
            loose: true,
            exclude: ['transform-typeof-symbol'],
          }
        ]
      ],
      plugins: [
        ...plugins,
        ["@babel/plugin-transform-runtime", {
          corejs: 2
        }]
      ],
    },
    modern: {
      presets: [
        ["@babel/preset-react", { useBuiltIns: true }],
        [
          "@babel/preset-env", {
            modules: false,
            targets: { esmodules: true },
            loose: true,
            useBuiltIns: 'entry',
            exclude: ['transform-typeof-symbol'],
          }
        ]
      ],
      plugins: [
        ...plugins,
        ["@babel/plugin-transform-runtime", {
          corejs: 2,
          useESModules: true,
        }]
      ],
    }
  }
};
