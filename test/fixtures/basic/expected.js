'use strict';

(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
  
    define(['/path/to/a', '/path/to/c', '/path/to/e', '/path/to/k', '/path/to/b', '/path/to/d'], factory);
  
  } else if (typeof module === 'object' && module.exports) {

    require('/path/to/b');
  
    require('/path/to/d');
  
    module.exports = factory(require('/path/to/a'), require('/path/to/c'), require('/path/to/e'), require('/path/to/k'));
  
  } else {

    root.returnExports = factory(root.a, root.c, root.e, root.k);

  }

})(this, function (a, c, _pathToE, _pathToK) {
  var e = _pathToE.e;
  var g = _pathToE.f;
  var h = _pathToE.h;
  var j = _pathToE.i;
  var k = _pathToK.k;
  doSomething();
  return x + y;
});
