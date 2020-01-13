/* eslint-disable no-console */
const { createServer } = require('http');

function makeServer(routes) {
  return (req, res) => {
    console.info('request ', req.url);

    function response(
      content = '',
      statusCode = 200,
      headers = {},
      options = {}
    ) {
      const contentHeader = Object.keys(headers).length
        ? headers
        : { 'Content-Type': 'text/html' };
      const encoding = options.encoding || 'utf8';

      res.writeHead(statusCode, contentHeader);
      res.end(content, encoding);
    }

    try {
      const makeRoute = routes(req, response);

      if (!makeRoute) {
        return response('<pre>Not found</pre>', 404);
      }

      return makeRoute();
    } catch (error) {
      console.error(error);
      return response(`<pre>${error.stack}</pre>`, 500);
    }
  };
}

module.exports = routes => createServer(makeServer(routes));
