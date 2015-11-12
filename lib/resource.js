'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createDecoratedClass = require('babel-runtime/helpers/create-decorated-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _fluxResourceCoreLibResource = require('flux-resource-core/lib/resource');

var _fluxResourceCoreLibResource2 = _interopRequireDefault(_fluxResourceCoreLibResource);

var _martyNative = require('marty-native');

var _overrideDecorator = require('override-decorator');

var _overrideDecorator2 = _interopRequireDefault(_overrideDecorator);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var MartyResource = (function (_FluxResource) {
  _inherits(MartyResource, _FluxResource);

  function MartyResource(options) {
    _classCallCheck(this, MartyResource);

    _get(Object.getPrototypeOf(MartyResource.prototype), 'constructor', this).call(this, options);

    this.assignObject('Constants', this.constants);
  }

  _createDecoratedClass(MartyResource, [{
    key: 'getFetch',
    decorators: [_overrideDecorator2['default']],
    value: function getFetch() {
      return fetch;
    }
  }, {
    key: 'generateApi',
    decorators: [_overrideDecorator2['default']],
    value: function generateApi(options) {
      var ResourceApi = (function (_HttpStateSource) {
        _inherits(ResourceApi, _HttpStateSource);

        function ResourceApi() {
          _classCallCheck(this, ResourceApi);

          _get(Object.getPrototypeOf(ResourceApi.prototype), 'constructor', this).apply(this, arguments);
        }

        return ResourceApi;
      })(_martyNative.HttpStateSource);

      _Object$assign(ResourceApi.prototype, _get(Object.getPrototypeOf(MartyResource.prototype), 'generateApi', this).call(this, options));

      return ResourceApi;
    }
  }, {
    key: 'generateConstants',
    value: function generateConstants(options) {
      return _constants2['default'].call(this, options);
    }
  }, {
    key: 'generateActions',
    decorators: [_overrideDecorator2['default']],
    value: function generateActions(options) {
      // Need to generate constants before we can generate dispatches for
      // actions.

      var _generateConstants2 = this.generateConstants(options);

      var constants = _generateConstants2.constants;
      var constantMappings = _generateConstants2.constantMappings;

      this.constants = constants;
      this.constantMappings = constantMappings;

      var ResourceActions = (function (_ActionCreators) {
        _inherits(ResourceActions, _ActionCreators);

        function ResourceActions() {
          _classCallCheck(this, ResourceActions);

          _get(Object.getPrototypeOf(ResourceActions.prototype), 'constructor', this).apply(this, arguments);
        }

        return ResourceActions;
      })(_martyNative.ActionCreators);

      _Object$assign(ResourceActions.prototype, _get(Object.getPrototypeOf(MartyResource.prototype), 'generateActions', this).call(this, options));

      return _actions2['default'].call(this, ResourceActions, options);
    }
  }, {
    key: 'generateDispatch',
    decorators: [_overrideDecorator2['default']],
    value: function generateDispatch(method, status) {
      var constant = this.constantMappings[method][status];

      // This will be called on an ActionCreators.
      return function dispatch(payload) {
        this.dispatch(constant, payload);
      };
    }
  }, {
    key: 'generateStore',
    decorators: [_overrideDecorator2['default']],
    value: function generateStore(options) {
      var ResourceStore = (function (_Store) {
        _inherits(ResourceStore, _Store);

        function ResourceStore() {
          _classCallCheck(this, ResourceStore);

          _get(Object.getPrototypeOf(ResourceStore.prototype), 'constructor', this).apply(this, arguments);
        }

        return ResourceStore;
      })(_martyNative.Store);

      _Object$assign(ResourceStore.prototype, _get(Object.getPrototypeOf(MartyResource.prototype), 'generateStore', this).call(this, options));

      return _store2['default'].call(this, ResourceStore, options);
    }
  }]);

  return MartyResource;
})(_fluxResourceCoreLibResource2['default']);

exports['default'] = MartyResource;
module.exports = exports['default'];