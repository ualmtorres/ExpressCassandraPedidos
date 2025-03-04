var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Documentación API Pedidos' });
}
);

// Crear un enpoint para testear la conexión
router.get('/api/health', (req, res) => {
  res.status(200).send({ message: 'API is working' });
});

module.exports = router;
