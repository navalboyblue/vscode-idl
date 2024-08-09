const babel = require('rollup-plugin-babel')
const rollup = require('rollup')
rollup.rollup({
  entry: 'app.js',
  external: [
    'moment'
  ],
  paths: {
    //moment: 'https://d3js.org/d3.v4.min.js'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      "presets": [    [
      "es2015",
      {
        "modules": false
      }
    ]]
    })
  ]
}).then(function (bundle) {
    bundle.write({
    format: 'es',
    dest: 'bundle.js'
    });
})