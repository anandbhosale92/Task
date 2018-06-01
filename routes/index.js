const routes   = require('express').Router();
const category = require('./category');
const product  = require('./product');

routes.use('/category', category);
routes.use('/product', product);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;
