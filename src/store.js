import lowerCaseFirst from 'lower-case-first';
import {handles} from 'marty';

function addHandlers(ResourceStore) {
  const {constantMappings} = this;

  return class ResourceStoreWithHandlers extends ResourceStore {
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
  };
}

function addFetch(
  ResourceStore,
  {
    actionsKey = `${lowerCaseFirst(this.name)}Actions`
  }
) {
  const {methodNames, name, plural} = this;

  const {getMany, getSingle} = methodNames;
  const refreshMany = `refresh${plural}`;
  const refreshSingle = `refresh${name}`;

  const baseGetMany = ResourceStore.prototype[getMany];
  const baseGetSingle = ResourceStore.prototype[getSingle];

  function fetchMany(options, refresh) {
    return this.fetch({
      id: this.collectionCacheKey(options),
      locally() {
        if (refresh) {
          refresh = false;
          return undefined;
        } else {
          return this::baseGetMany(options);
        }
      },
      remotely() {
        return this.getActions()[getMany](options);
      }
    });
  }

  function fetchSingle(id, options, refresh) {
    return this.fetch({
      id: this.itemCacheKey(id, options),
      locally() {
        if (refresh) {
          refresh = false;
          return undefined;
        } else {
          return this::baseGetSingle(id, options);
        }
      },
      remotely() {
        return this.getActions()[getSingle](id, options);
      }
    });
  }

  return class ResourceStoreWithFetch extends ResourceStore {
    getActions() {
      return this.app[actionsKey];
    }

    [getMany](options) {
      return this::fetchMany(options, false);
    }

    [refreshMany](options) {
      return this::fetchMany(options, true);
    }

    [getSingle](id, options) {
      return this::fetchSingle(id, options, false);
    }

    [refreshSingle](id, options) {
      return this::fetchSingle(id, options, true);
    }
  };
}

export default function extendStore(
  ResourceStore,
  {
    useFetch = true,
    ...options
  }
) {
  ResourceStore = this::addHandlers(ResourceStore, options);

  if (useFetch) {
    ResourceStore = this::addFetch(ResourceStore, options);
  }

  return ResourceStore;
}
