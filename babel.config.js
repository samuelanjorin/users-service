module.exports = {

  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ],
  plugins: ['@babel/proposal-object-rest-spread', '@babel/transform-runtime',]

}
