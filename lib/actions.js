'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = extendActions;

var _lowerCaseFirst = require('lower-case-first');

var _lowerCaseFirst2 = _interopRequireDefault(_lowerCaseFirst);

function extendActions(ResourceActions, _ref) {
  var _ref$apiKey = _ref.apiKey;
  var apiKey = _ref$apiKey === undefined ? (0, _lowerCaseFirst2['default'])(this.name) + 'Api' : _ref$apiKey;

  var ResourceActionsWithApi = (function (_ResourceActions) {
    _inherits(ResourceActionsWithApi, _ResourceActions);

    function ResourceActionsWithApi() {
      _classCallCheck(this, ResourceActionsWithApi);

      _get(Object.getPrototypeOf(ResourceActionsWithApi.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ResourceActionsWithApi, [{
      key: 'getApi',
      value: function getApi() {
        return this.app[apiKey];
      }
    }]);

    return ResourceActionsWithApi;
  })(ResourceActions);

  return ResourceActionsWithApi;
}

module.exports = exports['default'];