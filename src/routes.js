const path = require('path');
const mimeTypes = require('./mimetypes');
const controllers = require('./controllers');
const { getPostFilenames } = require('./templates');

function selectRoute(request, response) {
  function responser(
    content = '',
    statusCode = 200,
    headers = {},
    options = {}
  ) {
    const contentHeader = Object.keys(headers).length
      ? headers
      : { 'Content-Type': 'text/html' };
    const encoding = options.encoding || 'utf8';

    response.writeHead(statusCode, contentHeader);
    response.end(content, encoding);
  }

  const contentType = mimeTypes[path.extname(request.url)];
  const {
    homeController,
    filesController,
    blogController,
    postsController,
  } = controllers(request, responser);

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
