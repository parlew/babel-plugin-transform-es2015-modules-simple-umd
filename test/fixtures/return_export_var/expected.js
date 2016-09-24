'use strict';

(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
  
    define(['/path/to/a', '/path/to/c', '/path/to/e', '/path/to/b', '/path/to/d'], factory);
  
  } else if (typeof module === 'object' && module.exports) {

    require('/path/to/b');
  
    require('/path/to/d');
  
    module.exports = factory(require('/path/to/a'), require('/path/to/c'), require('/path/to/e'));
  
  } else {

    root.returnExports = factory(root.a, root.c, root.e);

  }

})(this, function (a, c, e) {
  doSomething();
  var _export_default = x + y;
  doSomethingElse();
  return _export_default;
});
