import terser from '@rollup/plugin-terser';
import importMapResolve from "./rollup-resolve.mjs";

export default {
  input: 'src/index.js',
  output: {
    file: 'build/index.js',
    format: 'esm'
  },
  plugins: [ importMapResolve({importMap:{
    imports:{
      "wip2p-settings/utils.js": {path: "./vendor/gx/ipfs/QmZvtid5k395BNFLyFnNzjaj3MKGLTbG592URd8Ra11Gma/wip2p-settings/src/utils.js"},
      "wip2p-settings": {path: "./vendor/gx/ipfs/QmZvtid5k395BNFLyFnNzjaj3MKGLTbG592URd8Ra11Gma/wip2p-settings/src/settings.js"},
      "ethereum-blockies": {path: "./gx/ethereum-blockies/blockies.min.js", external: true}
    }    
  }}), terser() ]
}

