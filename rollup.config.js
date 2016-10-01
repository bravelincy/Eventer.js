import buble from 'rollup-plugin-buble';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

const NODE_ENV = process.env.NODE_ENV;
const banner = 
`/**
 * @author joenillam@gmail.com
 */
`
let dest = 'dist/Eventer.js';
let plugins = [buble(), eslint()];

if (NODE_ENV === 'production') {
  dest = 'dist/Eventer.min.js';
  plugins.push(uglify());
}

process.env.NODE_ENV === 'production'
export default {
  entry: 'src/entry.js',
  format: 'iife',
  indent: true,
  dest,
  plugins,
  banner,
  external: ['window'],
  context: 'window',
  globals: {
    window: 'window'
  }
};
