const path = require('path');
const mimeTypes = require('./mimetypes');
const controllers = require('./controllers');
const { getPostFilenames } = require('./templates');

function selectRoute(request, response) {
  const contentType = mimeTypes[path.extname(request.url)];
  const {
    homeController,
    filesController,
    blogController,
    postsController,
  } = controllers(request, response);

  const chooser = {
    get: {
      '/': () => homeController(),
      '/blog': () => blogController(),
    },
  };

  if (contentType) chooser.get[request.url] = () => filesController();

  getPostFilenames().forEach(name => {
    chooser.get[`/blog/${name}`] = () => postsController(name);
  });

  return chooser[String(request.method).toLowerCase()][request.url];
}

module.exports = selectRoute;
