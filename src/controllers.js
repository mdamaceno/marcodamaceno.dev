const path = require('path');
const { markdown2HTML, getComponent, getFile } = require('./templates');
const mimeTypes = require('./mimetypes');

require('dotenv').config();

const APP_NAME = process.env.APP_NAME || '';
const DEFAULT_LANG = process.env.DEFAULT_LANG || 'pt-br';

const controllers = (request, response) => {
  const contentType = mimeTypes[path.extname(request.url)];

  return {
    homeController: () => {
      const content = getComponent('layout/main', {
        lang: DEFAULT_LANG,
        title: APP_NAME,
        content: `${getComponent('my-social')}${getComponent(
          'my-description'
        )}`,
      });

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(content, 'utf-8');
    },

    postsController: name => {
      const { html, metadata } = markdown2HTML(name);
      const content = getComponent('layout/main', {
        lang: DEFAULT_LANG,
        title: metadata && metadata.title ? `${metadata.title} - ` : APP_NAME,
        description:
          metadata && metadata.description ? metadata.description : '',
        content: `${getComponent('my-posts', { html, metadata })}`,
      });

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(content, 'utf-8');
    },

    filesController: () => {
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(getFile(request.url), 'utf-8');
    },
  };
};

module.exports = controllers;
