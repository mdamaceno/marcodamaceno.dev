const showdown = require('showdown');
const fs = require('fs');
const path = require('path');
const readdirSyncDeep = require('recursive-readdir-synchronous');

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

function getPostFilenames() {
  const baseDir = path.join(process.env.INIT_CWD, 'posts');
  const files = readdirSyncDeep(baseDir);
  const names = files
    .map(file => file.replace(baseDir, ''))
    .filter(file => path.extname(file) === '.md')
    .filter(file => file.charAt(0) !== '_')
    .map(file => file.replace('.md', ''))
    .map(file => {
      const basename = path.basename(file);
      const splitName = basename.split('-');
      const isoDate = `${splitName[0]}-${splitName[1]}-${splitName[2]}`;

      return {
        basename,
        filename: file,
        formattedFilename: file.replace(`${isoDate}-`, ''),
        date: `${isoDate}`,
      };
    });

  return names;
}

function markdown2HTML(name) {
  const converter = new showdown.Converter({ metadata: true });
  const content = fs.readFileSync(
    path.join(process.env.INIT_CWD, 'posts', `${name.filename}.md`),
    { encoding: 'utf8' }
  );

  const html = converter.makeHtml(content);
  const metadata = converter.getMetadata();
  metadata.createdAt = name.date;

  return { html, metadata };
}

function getPostsMetadata() {
  return getPostFilenames()
    .map(name => ({ name, meta: markdown2HTML(name).metadata }))
    .filter(obj => Object.keys(obj.meta).length && obj.meta.title)
    .map(obj => ({
      title: obj.meta.title,
      summary: obj.meta.summary,
      date: obj.name.date,
      url: obj.name.formattedFilename,
      slug: obj.name.basename,
    }));
}

module.exports = {
  markdown2HTML,
  getPostFilenames,
  getFile,
  getComponent,
  getPostsMetadata,
};
