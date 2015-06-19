# flux-resource-marty
Automatic Marty object generation for RESTful resources

[![npm version](https://badge.fury.io/js/flux-resource-marty.svg)](http://badge.fury.io/js/flux-resource-marty)

## Usage

```js
import martyResource from 'flux-resource-marty';
import {Application, createContainer, HttpStateSource} from 'marty';

import UserList from './components/UserList';

HttpStateSource.removeHook('parseJSON');

const {UserActions, UserApi, UserStore} = martyResource({
  name: 'user',
  urlFunc: id => `http://jsonplaceholder.typicode.com/users/${id}`,
  postprocessors: [res => res.json()]
});

class ExampleApplication extends Application {
  constructor(options) {
    super(options);

    this.register({
      userActions: UserActions,
      userApi: UserApi,
      userStore: UserStore
    });
  }
}

const UserListWithData = createContainer({
  UserList,
  {
    listenTo: 'userStore',
    fetch: {
      users() {
        return this.app.userStore.getUsers();
      }
    }
  }
);
```

More detailed documentation forthcoming.
