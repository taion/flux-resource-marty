import lowerCaseFirst from 'lower-case-first';
import {handles} from 'marty';
import Override from 'override-decorator';

function addHandlers(ResourceStore) {
  const {constantMappings} = this;

  return class ResourceStoreWithHandlers extends ResourceStore {
    @Override
    @handles(constantMappings.getMany.done)
    getManyDone(payload) {
      super.getManyDone(payload);
      this.hasChanged();
    }

    @Override
    @handles(constantMappings.getSingle.done)
    getSingleDone(payload) {
      super.getSingleDone(payload);
      this.hasChanged();
    }

    @handles(
      constantMappings.postSingle.done,
      constantMappings.putSingle.done,
      constantMappings.patchSingle.done
    )
    changeSingleDone(args) {
      // These change actions may return the inserted or modified object, so
      // update that object if possible.
      if (args.result) {
        this.getSingleDone(args);
      }
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

  return class ResourceStoreWithFetch extends ResourceStore {
    getActions() {
      return this.app[actionsKey];
    }

    [getMany](options, {refresh} = {}) {
      return this.fetch({
        id: `c${this.collectionKey(options)}`,
        locally: () => this.localGetMany(options),
        remotely: () => this.remoteGetMany(options),
        refresh
      });
    }

    [refreshMany](options) {
      return this[getMany](options, {refresh: true});
    }

    localGetMany(options) {
      return super[getMany](options);
    }

    remoteGetMany(options) {
      return this.getActions()[getMany](options);
    }

    [getSingle](id, options, {refresh} = {}) {
      return this.fetch({
        id: `i${this.itemKey(id, options)}`,
        locally: () => this.localGetSingle(id, options),
        remotely: () => this.remoteGetSingle(id, options),
        refresh
      });
    }

    [refreshSingle](id, options) {
      return this[getSingle](id, options, {refresh: true});
    }

    localGetSingle(id, options) {
      return super[getSingle](id, options);
    }

    remoteGetSingle(id, options) {
      return this.getActions()[getSingle](id, options);
    }

    fetch({refresh, ...options}) {
      if (refresh) {
        const baseLocally = options.locally;
        options.locally = function refreshLocally() {
          if (refresh) {
            refresh = false;
            return undefined;
          } else {
            return this::baseLocally();
          }
        };
      }

      return super.fetch(options);
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
