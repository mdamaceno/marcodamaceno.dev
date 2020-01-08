const { getPostFilenames, buildHTML } = require('./templates');

function selectRoute(request, response) {
  const chooser = {
    get: {
      '/': () => {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(buildHTML('ola'), 'utf-8');
      },
    },
  };

  getPostFilenames().forEach(name => {
    chooser.get[`/${name}`] = () => {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(buildHTML(name), 'utf-8');
    };
  });

  return chooser[String(request.method).toLowerCase()][request.url];
}

module.exports = selectRoute;
