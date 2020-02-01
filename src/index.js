const server = require('./server');
const routes = require('./routes');

require('dotenv').config();

const port = process.env.APP_PORT || 8080;

server(routes).listen(port);

// eslint-disable-next-line no-console
console.log(`Server running at http://127.0.0.1:${port}/`);
