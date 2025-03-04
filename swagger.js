const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API REST para gestión historial de pedidos',
    description: 'API REST para gestión historial de pedidos y seguimiento en tiempo real con Express y Cassandra'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js', './routes/orders.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);