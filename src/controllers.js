const {
  markdown2HTML,
  getComponent,
  getPostsMetadata,
} = require('./templates');

require('dotenv').config();

const APP_NAME = process.env.APP_NAME || '';
const DEFAULT_LANG = process.env.DEFAULT_LANG || 'pt-br';

const controllers = (request, response) => {
  return {
    homeController: () => {
      const posts = getPostsMetadata();
      let postsComponent = '';
      posts.forEach(post => {
        postsComponent += `<div><h1>${post.title}</h1><p>${post.summary}</p></div>`;
      });

      const content = getComponent('layout/main', {
        lang: DEFAULT_LANG,
        title: APP_NAME,
        content:
          getComponent('my-description') +
          getComponent('navbar') +
          getComponent('main', {
            'list-posts': getComponent('list-posts', { posts: postsComponent }),
            sidebar: getComponent('sidebar'),
          }),
      });

      return response(content);
    },

    blogController: () => {
      const content = getComponent('layout/main', { content: 'ola' });
      return response(content);
    },

    postsController: name => {
      const { html, metadata } = markdown2HTML(name);
      const content = getComponent('layout/main', {
        lang: DEFAULT_LANG,
        title: metadata && metadata.title ? `${metadata.title} - ` : APP_NAME,
        description:
          metadata && metadata.description ? metadata.description : '',
        content: getComponent('my-posts', { html, metadata }),
      });

      return response(content);
    },
  };
};

module.exports = controllers;
