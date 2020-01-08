const showdown = require('showdown');
const fs = require('fs');
const path = require('path');
const top = require('./default/top');
const bottom = require('./default/bottom');

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

function buildHTML(name) {
  const { html, metadata } = markdown2HTML(name);

  return `${top(metadata)}${html}${bottom}`;
}

module.exports = { markdown2HTML, getPostFilenames, buildHTML };
