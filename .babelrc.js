const plugins = [
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-export-default-from",
  '@babel/plugin-transform-react-jsx',
];

module.exports = {
  env: {
    legacy: {
      presets: [
        [
          "@babel/preset-env", {
            exclude: ["@babel/plugin-transform-typeof-symbol"],
            modules: false,
            loose: true,
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
        ["@babel/plugin-transform-runtime", { corejs: 3 }]
      ],
    },
    modern: {
      presets: ['@babel/preset-modules'],
      plugins,
    }
  }
};
