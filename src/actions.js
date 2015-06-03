import lowerCaseFirst from 'lower-case-first';

export default function extendActions(
  ResourceActions,
  {
    apiKey = `${lowerCaseFirst(this.name)}Api`
  }
) {
  class ResourceActionsWithApi extends ResourceActions {
    getApi() {
      return this.app[apiKey];
    }
  }

  return ResourceActionsWithApi;
}
