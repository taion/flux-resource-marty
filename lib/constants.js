'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = generateConstants;

var _constantCase = require('constant-case');

var _constantCase2 = _interopRequireDefault(_constantCase);

var _fluxResourceCoreLibConfig = require('flux-resource-core/lib/config');

var _martyNative = require('marty-native');

function generateConstants() {
  var methodNames = this.methodNames;

  var constantNames = _Object$keys(this.methodNames).map(function (method) {
    return (0, _constantCase2['default'])(methodNames[method]);
  });
  var constants = (0, _martyNative.createConstants)(constantNames);

  var constantMappings = {};

  _fluxResourceCoreLibConfig.METHODS.forEach(function mapMethodConstants(method) {
    var methodName = methodNames[method];
    var methodConstantMappings = {};
    constantMappings[method] = methodConstantMappings;

    _fluxResourceCoreLibConfig.STATUSES.forEach(function mapStatusConstants(status) {
      var statusName = status === 'starting' ? '' : status;
      var constantName = (0, _constantCase2['default'])(methodName + ' ' + statusName);

      methodConstantMappings[status] = constants[constantName];
    });
  });

  return { constants: constants, constantMappings: constantMappings };
}

module.exports = exports['default'];