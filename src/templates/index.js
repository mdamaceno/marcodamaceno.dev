const showdown = require('showdown');
const fs = require('fs');
const path = require('path');

function getFile(name) {
  return fs.readFileSync(path.join(process.env.INIT_CWD, 'public', `${name}`));
}

function getComponent(name, params = {}) {
  let content = fs.readFileSync(
    path.join(process.env.INIT_CWD, 'src/templates/components', `${name}.html`),
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

function getPostsMetadata() {
  return getPostFilenames()
    .map(name => markdown2HTML(name).metadata)
    .filter(meta => Object.keys(meta).length)
    .map(meta => ({
      title: meta.title,
      summary: meta.summary,
    }));
}

module.exports = {
  markdown2HTML,
  getPostFilenames,
  getFile,
  getComponent,
  getPostsMetadata,
};
