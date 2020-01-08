/* eslint-disable no-console */
function makeServer(routes) {
  return (request, response) => {
    console.log('request ', request.url);

    try {
      const makeRoute = routes(request, response);

      if (!makeRoute) {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('<pre>Not found</pre>', 'utf-8');
      }

      return makeRoute();
    } catch (error) {
      console.error(error);
      response.writeHead(500, { 'Content-Type': 'text/html' });
      response.end(`<pre>${error.stack}</pre>`, 'utf-8');
    }

    return undefined;
  };
}

module.exports = makeServer;
