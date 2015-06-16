import martyResource from 'flux-resource-marty';
import {
  Application,
  ApplicationContainer,
  createContainer,
  HttpStateSource
} from 'marty';
import React from 'react';

HttpStateSource.removeHook('parseJSON');

const {PostActions, PostApi, PostStore} = martyResource({
  name: 'post',
  urlFunc: id => `http://jsonplaceholder.typicode.com/posts/${id}`,
  postprocessors: [
    function parseJson(res) {
      if (!res.ok) {
        throw res.statusText;
      }

      return res.json();
    }
  ]
});

class JsonPlaceholderApplication extends Application {
  constructor(options) {
    super(options);

    this.register({
      postActions: PostActions,
      postApi: PostApi,
      postStore: PostStore
    });
  }
}

class PostList extends React.Component {
  render() {
    return (
      <div>
        {this.renderPosts()}
      </div>
    );
  }

  renderPosts() {
    return this.props.posts.map(this.renderPost);
  }

  renderPost(post, i) {
    return (
      <div key={i}>
        {JSON.stringify(post)}
      </div>
    );
  }
}

PostList = createContainer(
  PostList,
  {
    listenTo: 'postStore',
    fetch: {
      posts() {
        return this.app.postStore.getPosts();
      }
    }
  }
);

const app = new JsonPlaceholderApplication();

const mountNode = document.createElement("DIV");
document.body.appendChild(mountNode);

React.render(
  (
    <ApplicationContainer app={app}>
      <PostList />
    </ApplicationContainer>
  ),
  mountNode
);
