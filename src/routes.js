const path = require('path');
const mimeTypes = require('./mimetypes');
const controllers = require('./controllers');
const { getPostFilenames, getFile } = require('./templates');

function selectRoute(request, response) {
  const contentType = mimeTypes[path.extname(request.url)];
  const { homeController, blogController, postsController } = controllers(
    request,
    response
  );

  const chooser = {
    get: {
      '/': () => homeController(),
      '/blog': () => blogController(),
    },
  };

  if (contentType)
    chooser.get[request.url] = () =>
      response(getFile(request.url), 200, { 'Content-Type': contentType });

  getPostFilenames().forEach(name => {
    chooser.get[`/blog/${name}`] = () => postsController(name);
  });

  return chooser[String(request.method).toLowerCase()][request.url];
}

module.exports = selectRoute;
