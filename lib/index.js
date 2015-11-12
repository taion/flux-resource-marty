'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = martyResource;

var _resource = require('./resource');

var _resource2 = _interopRequireDefault(_resource);

function martyResource(options) {
  return new _resource2['default'](options);
}

module.exports = exports['default'];