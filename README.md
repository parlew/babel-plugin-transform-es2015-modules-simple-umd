# babel-plugin-transform-es2015-modules-simple-umd

Limited transformer for ECMAScript 2015 modules (UMD)

Converts this code:
```js
import x from '/path/to/x';
import y from '/path/to/y';
import from '/path/to/z';
doSomething();
export default x + y;
```

Into this one:
```js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['/path/to/x', '/path/to/y'], factory);  
  } else if (typeof module === 'object' && module.exports) {
    require('/path/to/z');
    module.exports = factory(require('/path/to/x'), require('/path/to/y'));
  } else {
    root.returnExports = factory(root.x, root.y);
  }
})(this, function (x, y) {
  doSomething();
  return x + y;
});
```

Supported features:
- ``import SPECIFIER from 'PATH'``
- ``import 'PATH'``
- ``import {SPECIFIER1, SPECIFIER2 as SPECIFIER3} from 'PATH' but not as well as the AMD version. It's difficult to translate to a global variable.``
- ``export default NODE``

Other features aren't supported.

**Warning**. If no ``import`` or ``export`` are presented in JavaScript file, the plugin does nothing (means it doesn't wrap code with ``define``).

## Installation

```sh
$ npm install --save-dev babel-plugin-transform-es2015-modules-simple-umd
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-es2015-modules-simple-umd"]
}
```

### Via Node API

```javascript
require('babel').transform('code', {
  plugins: ['transform-es2015-modules-simple-umd']
});
```

Thanks to [Finom](https://github.com/finom/babel-plugin-transform-es2015-modules-simple-amd).
Thanks to [RReverser](https://github.com/RReverser/babel-plugin-hello-world).
