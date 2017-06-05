Install
=======

```sh
npm install jsonsquasher --save
```

Include
=======

**NodeJS**

```js
const jsonsquasher = require('jsonsquasher');
```

**Browser**

```html
<script src='node_modules/jsonsquasher/build/jsonsquasher.js' type='text/javascript'></script>
```
...or use ES6 *import*

Use
===

```js
// Compression
const compressedJson = jsonsquasher.compress(json);
// Decompression
const decompressedJson = jsonsquasher.compress(compressedJson);
```


```js
// Faster and less memory usage, but with JSON mutation (use at your own risk)
console.log(json);
jsonsquasher.compress(json,{mutateJSON:true});
jsonsquasher.decompress(json,{mutateJSON:true});
console.log(json);
```
