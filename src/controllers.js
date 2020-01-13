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
      const posts = getPostsMetadata().sort((a, b) => a - b);
      const content = getComponent('layout/main', {
        lang: DEFAULT_LANG,
        title: APP_NAME,
        content:
          getComponent('my-description', {
            social: `<a href="${process.env.PROFILE_GITHUB}" target="_blank"><ion-icon class="social-icon" name="logo-github"></ion-icon></a> <a href="${process.env.PROFILE_LINKEDIN}" target="_blank"><ion-icon class="social-icon" name="logo-linkedin"></ion-icon></a>`,
          }) +
          getComponent('navbar') +
          getComponent('blog', {
            posts: posts.reduce((html, post) => {
              return `${html}<div class="card post-title-card">
                <div class="card-body">
                  <a href="${post.url}">${post.title}</a> - <i>${post.date}</i>
                </div>
              </div>`;
            }, ''),
            sidebar: getComponent('sidebar'),
          }),
      });

      return response(content);
    },

    postsController: name => {
      const { html, metadata } = markdown2HTML(name);
      const content = getComponent('layout/main', {
        lang: DEFAULT_LANG,
        title:
          metadata && metadata.title
            ? `${metadata.title} - ${APP_NAME}`
            : APP_NAME,
        description:
          metadata && metadata.description ? metadata.description : '',
        content:
          getComponent('post/navbar', { social: `<li class="nav-item">
            <a class="nav-link active" href="${process.env.PROFILE_GITHUB}" target="_blank"><ion-icon class="social-icon" name="logo-github"></ion-icon></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="${process.env.PROFILE_LINKEDIN}" target="_blank"><ion-icon class="social-icon" name="logo-linkedin"></ion-icon></a>
          </li>` }) +
          getComponent('post/post', {
            post: html,
            title: metadata.title,
            createdAt: metadata.createdAt,
          }),
      });

      return response(content);
    },
  };
};

module.exports = controllers;
