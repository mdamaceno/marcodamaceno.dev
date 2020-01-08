const path = require('path');
const {
  getPostFilenames,
  buildPostsHTML,
  buildHomeHTML,
  getFile,
} = require('./templates');

function selectRoute(request, response) {
  const chooser = {
    get: {
      '/': () => {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(buildHomeHTML(), 'utf-8');
      },
    },
  };

  if (path.extname(request.url) === '.css') {
    chooser.get[request.url] = () => {
      response.writeHead(200, { 'Content-Type': 'text/css' });
      response.end(getFile(request.url), 'utf-8');
    };
  }

  if (path.extname(request.url) === '.jpg') {
    chooser.get[request.url] = () => {
      response.writeHead(200, { 'Content-Type': 'image/jpg' });
      response.end(getFile(request.url));
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
