cd node_modules
cd ref-napi
npx node-gyp configure
npx node-gyp build
npm i -S ref-array-napi ref-struct-napi
