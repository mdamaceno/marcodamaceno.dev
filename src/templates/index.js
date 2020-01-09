const showdown = require('showdown');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const APP_NAME = process.env.APP_NAME || '';
const DEFAULT_LANG = process.env.DEFAULT_LANG || 'pt-br';

function getFile(name) {
  return fs.readFileSync(path.join(process.env.INIT_CWD, 'public', `${name}`));
}

function getComponent(name, params = {}) {
  let content = fs.readFileSync(
    path.join(__dirname, 'components', `${name}.html`),
    { encoding: 'utf8' }
  );
  Object.keys(params).forEach(param => {
    content = content.replace(`{{${param}}}`, params[param]);
  });

  return content;
}

function markdown2HTML(name) {
  const converter = new showdown.Converter({ metadata: true });
  const content = fs.readFileSync(
    path.join(process.env.INIT_CWD, 'posts', `${name}.md`),
    { encoding: 'utf8' }
  );

  const html = converter.makeHtml(content);
  const metadata = converter.getMetadata();

  return { html, metadata };
}

function getPostFilenames() {
  const files = fs.readdirSync(path.join(process.env.INIT_CWD, 'posts'));
  const names = files
    .filter(file => path.extname(file) === '.md')
    .filter(file => file.charAt(0) !== '_')
    .map(file => path.basename(file, '.md'));

  return names;
}

function buildHomeHTML() {
  return getComponent('layout/main', {
    lang: DEFAULT_LANG,
    title: APP_NAME,
    content: `${getComponent('my-social')}${getComponent('my-description')}`,
  });
}

function buildPostsHTML(name) {
  const { html, metadata } = markdown2HTML(name);
  return getComponent('layout/main', {
    lang: DEFAULT_LANG,
    title: metadata && metadata.title ? `${metadata.title} - ` : APP_NAME,
    description: metadata && metadata.description ? metadata.description : '',
    content: `${getComponent('my-posts', { html, metadata })}`,
  });
}

module.exports = {
  markdown2HTML,
  getPostFilenames,
  buildPostsHTML,
  buildHomeHTML,
  getFile,
};
