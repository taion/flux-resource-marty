import lowerCaseFirst from 'lower-case-first';
import {handles} from 'marty';

export default function extendStore(
  ResourceStore,
  {
    useFetch = true,
    actionsKey = `${lowerCaseFirst(this.name)}Actions`
  }
) {
  const {constantMappings, methodNames} = this;
  let Store = ResourceStore;

  class ResourceStoreWithHandlers extends Store {
    constructor(options) {
      super(options);

      this.resetCache();
    }

    @handles(constantMappings.getMany.done)
    receiveMany(args) {
      super.receiveMany(args);
      this.hasChanged();
    }

    @handles(constantMappings.getSingle.done)
    receiveSingle(args) {
      super.receiveSingle(args);
      this.hasChanged();
    }
  }
  Store = ResourceStoreWithHandlers;

  if (useFetch) {
    const {getMany, getSingle} = methodNames;

    class ResourceStoreWithFetch extends Store {
      getActions() {
        return this.app[actionsKey];
      }

      [getMany](options) {
        return this.fetch(
          this.collectionCacheKey(options),
          () => super[getMany](options),
          () => this.getActions()[getMany](options)
        );
      }

      [getSingle](id, options) {
        return this.fetch(
          this.itemCacheKey(id, options),
          () => super[getSingle](id, options),
          () => this.getActions()[getSingle](id, options)
        );
      }
    }
    Store = ResourceStoreWithFetch;
  }

  return Store;
}
