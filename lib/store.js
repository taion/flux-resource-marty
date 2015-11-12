'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createDecoratedClass = require('babel-runtime/helpers/create-decorated-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = extendStore;

var _lowerCaseFirst = require('lower-case-first');

var _lowerCaseFirst2 = _interopRequireDefault(_lowerCaseFirst);

var _martyNative = require('marty-native');

var _overrideDecorator = require('override-decorator');

var _overrideDecorator2 = _interopRequireDefault(_overrideDecorator);

function addHandlers(ResourceStore) {
  var constantMappings = this.constantMappings;

  return (function (_ResourceStore) {
    _inherits(ResourceStoreWithHandlers, _ResourceStore);

    function ResourceStoreWithHandlers() {
      _classCallCheck(this, ResourceStoreWithHandlers);

      _get(Object.getPrototypeOf(ResourceStoreWithHandlers.prototype), 'constructor', this).apply(this, arguments);
    }

    _createDecoratedClass(ResourceStoreWithHandlers, [{
      key: 'getManyDone',
      decorators: [(0, _martyNative.handles)(constantMappings.getMany.done), _overrideDecorator2['default']],
      value: function getManyDone(payload) {
        _get(Object.getPrototypeOf(ResourceStoreWithHandlers.prototype), 'getManyDone', this).call(this, payload);
        this.hasChanged();
      }
    }, {
      key: 'getSingleDone',
      decorators: [(0, _martyNative.handles)(constantMappings.getSingle.done), _overrideDecorator2['default']],
      value: function getSingleDone(payload) {
        _get(Object.getPrototypeOf(ResourceStoreWithHandlers.prototype), 'getSingleDone', this).call(this, payload);
        this.hasChanged();
      }
    }, {
      key: 'changeSingleDone',
      decorators: [(0, _martyNative.handles)(constantMappings.postSingle.done, constantMappings.putSingle.done, constantMappings.patchSingle.done)],
      value: function changeSingleDone(args) {
        // These change actions may return the inserted or modified object, so
        // update that object if possible.
        if (args.result) {
          this.getSingleDone(args);
        }
      }
    }]);

    return ResourceStoreWithHandlers;
  })(ResourceStore);
}

function addFetch(ResourceStore, _ref) {
  var _ref$actionsKey = _ref.actionsKey;
  var actionsKey = _ref$actionsKey === undefined ? (0, _lowerCaseFirst2['default'])(this.name) + 'Actions' : _ref$actionsKey;
  var methodNames = this.methodNames;
  var name = this.name;
  var plural = this.plural;
  var getMany = methodNames.getMany;
  var getSingle = methodNames.getSingle;

  var refreshMany = 'refresh' + plural;
  var refreshSingle = 'refresh' + name;

  return (function (_ResourceStore2) {
    _inherits(ResourceStoreWithFetch, _ResourceStore2);

    function ResourceStoreWithFetch() {
      _classCallCheck(this, ResourceStoreWithFetch);

      _get(Object.getPrototypeOf(ResourceStoreWithFetch.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ResourceStoreWithFetch, [{
      key: 'getActions',
      value: function getActions() {
        return this.app[actionsKey];
      }
    }, {
      key: getMany,
      value: function value(options) {
        var _this = this;

        var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var refresh = _ref2.refresh;

        return this.fetch({
          id: 'c' + this.collectionKey(options),
          locally: function locally() {
            return _this.localGetMany(options);
          },
          remotely: function remotely() {
            return _this.remoteGetMany(options);
          },
          refresh: refresh
        });
      }
    }, {
      key: refreshMany,
      value: function value(options) {
        return this[getMany](options, { refresh: true });
      }
    }, {
      key: 'localGetMany',
      value: function localGetMany(options) {
        return _get(Object.getPrototypeOf(ResourceStoreWithFetch.prototype), getMany, this).call(this, options);
      }
    }, {
      key: 'remoteGetMany',
      value: function remoteGetMany(options) {
        return this.getActions()[getMany](options);
      }
    }, {
      key: getSingle,
      value: function value(id, options) {
        var _this2 = this;

        var _ref3 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        var refresh = _ref3.refresh;

        return this.fetch({
          id: 'i' + this.itemKey(id, options),
          locally: function locally() {
            return _this2.localGetSingle(id, options);
          },
          remotely: function remotely() {
            return _this2.remoteGetSingle(id, options);
          },
          refresh: refresh
        });
      }
    }, {
      key: refreshSingle,
      value: function value(id, options) {
        return this[getSingle](id, options, { refresh: true });
      }
    }, {
      key: 'localGetSingle',
      value: function localGetSingle(id, options) {
        return _get(Object.getPrototypeOf(ResourceStoreWithFetch.prototype), getSingle, this).call(this, id, options);
      }
    }, {
      key: 'remoteGetSingle',
      value: function remoteGetSingle(id, options) {
        return this.getActions()[getSingle](id, options);
      }
    }, {
      key: 'fetch',
      value: function fetch(_ref4) {
        var refresh = _ref4.refresh;

        var options = _objectWithoutProperties(_ref4, ['refresh']);

        if (refresh) {
          (function () {
            var baseLocally = options.locally;
            options.locally = function refreshLocally() {
              if (refresh) {
                refresh = false;
                return undefined;
              } else {
                return baseLocally.call(this);
              }
            };
          })();
        }

        return _get(Object.getPrototypeOf(ResourceStoreWithFetch.prototype), 'fetch', this).call(this, options);
      }
    }]);

    return ResourceStoreWithFetch;
  })(ResourceStore);
}

function extendStore(ResourceStore, _ref5) {
  var _ref5$useFetch = _ref5.useFetch;
  var useFetch = _ref5$useFetch === undefined ? true : _ref5$useFetch;

  var options = _objectWithoutProperties(_ref5, ['useFetch']);

  ResourceStore = addHandlers.call(this, ResourceStore, options);

  if (useFetch) {
    ResourceStore = addFetch.call(this, ResourceStore, options);
  }

  return ResourceStore;
}

module.exports = exports['default'];