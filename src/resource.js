import FluxResource from 'flux-resource-core/lib/resource';
import {ActionCreators, HttpStateSource, Store} from 'marty';
import Override from 'override-decorator';

import generateConstants from './constants';
import extendActions from './actions';
import extendStore from './store';

export default class MartyResource extends FluxResource {
  constructor(options) {
    super(options);

    this.assignObject('Constants', this.constants);
  }

  @Override
  getFetch() {
    // This will be called on an HttpStateSource.
    return function fetch(url, request) {
      return this.request({url, ...request});
    };
  }

  @Override
  generateApi(options) {
    class ResourceApi extends HttpStateSource {}
    Object.assign(ResourceApi.prototype, super.generateApi(options));

    return ResourceApi;
  }

  generateConstants(options) {
    return this::generateConstants(options);
  }

  @Override
  generateActions(options) {
    // Need to generate constants before we can generate dispatches for
    // actions.
    const {constants, constantMappings} = this.generateConstants(options);
    this.constants = constants;
    this.constantMappings = constantMappings;

    class ResourceActions extends ActionCreators {}
    Object.assign(ResourceActions.prototype, super.generateActions(options));

    return this::extendActions(ResourceActions, options);
  }

  @Override
  generateDispatch(method, status) {
    const constant = this.constantMappings[method][status];

    // This will be called on an ActionCreators.
    return function dispatch(payload) {
      this.dispatch(constant, payload);
    };
  }

  @Override
  generateStore(options) {
    class ResourceStore extends Store {}
    Object.assign(ResourceStore.prototype, super.generateStore(options));

    return this::extendStore(ResourceStore, options);
  }
}
