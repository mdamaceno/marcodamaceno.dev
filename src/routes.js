const path = require('path');
const mimeTypes = require('./mimetypes');
const {
  getPostFilenames,
  buildPostsHTML,
  buildHomeHTML,
  getFile,
} = require('./templates');

function selectRoute(request, response) {
  const contentType = mimeTypes[path.extname(request.url)];

  const chooser = {
    get: {
      '/': () => {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(buildHomeHTML(), 'utf-8');
      },
    },
  };

  if (contentType) {
    chooser.get[request.url] = () => {
      response.writeHead(200, {
        'Content-Type': contentType,
      });
      response.end(getFile(request.url), 'utf-8');
    };
  }

  getPostFilenames().forEach(name => {
    chooser.get[`/blog/${name}`] = () => {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(buildPostsHTML(name), 'utf-8');
    };
  });

  return chooser[String(request.method).toLowerCase()][request.url];
}

module.exports = selectRoute;
