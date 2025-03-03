var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(`
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>API Documentation</title>
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
    />
  </head>

  <body>
    <div class="container">
      <h1>
        API REST para gestión de pedidos y seguimiento en tiempo real
      </h1>
      <table class="table">
        <thead>
          <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>POST</td>
            <td><code>/api/orders</code></td>
            <td>Crear un nuevo pedido</td>
          </tr>
          <tr>
            <td>GET</td>
            <td><code>/api/orders</code></td>
            <td>Obtener todos los pedidos. Parámetros opcionales: <code>user_id</code> y <code>status</code></td>
          </tr>
          <tr>
            <td>GET</td>
            <td><code>/api/orders/:id</code></td>
            <td>Obtener los detalles de un pedido</td>
          </tr>
          <tr>
            <td>PUT</td>
            <td><code>/api/orders/:id</code></td>
            <td>Actualizar el estado de un pedido</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="container">
      <h2>Ejemplo de JSON de un pedido</h2>
      <pre>
        <code>
{
    "order_id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "order_date": "2023-10-10T10:00:00Z",
    "status": "pending",
    "total": 100.0,
    "items": [
        {
            "product_id": "product1",
            "quantity": 2,
            "price": 10.0
        },
        {
            "product_id": "product2",
            "quantity": 1,
            "price": 20.0
        }
    ]
}
        </code>
      </pre>
    </div>

    <div class="container">
      <h2>Ejemplo de JSON de un cambio de estado de un pedido</h2>
      <pre>
        <code>
{
    "status": "delivered"
}
        </code>
      </pre>
    </div>

    <!-- Scripts necesarios para Bootstrap -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  </body>
  `);
});

module.exports = router;
