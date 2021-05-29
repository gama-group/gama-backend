module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ],
      '@babel/preset-typescript'
    ],
    plugins: [
      ['module-resolver', {
        alias: {
          '@config': './src/config',
          '@models': './src/models',
          '@controllers': './src/controllers',
          '@views': './src/views'
        }
      }],
      "babel-plugin-transform-typescript-metadata",
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose": true }],
    ],
    ignore: [
      '**/*.spec.ts'
    ]
}