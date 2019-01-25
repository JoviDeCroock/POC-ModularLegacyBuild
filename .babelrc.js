const plugins = [
  "@babel/plugin-transform-runtime",
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-export-default-from"
]

module.exports = {
  env: {
    legacy: {
      presets: [
        "@babel/preset-react",
        [
          "@babel/preset-env", {
            modules: false,
            useBuiltIns: "entry",
            targets: ['last 2 versions', 'ie >= 11', 'safari >= 7'],
            loose: true,
          }
        ]
      ],
      plugins,
    },
    modern: {
      presets: [
        "@babel/preset-react",
        [
          "@babel/preset-env", {
            modules: false,
            targets: { esmodules: true },
            loose: true
          }
        ]
      ],
      plugins,
    }
  }
};
