const router  = require('express').Router();
const product = require('../../controllers/product');


router.get('/:categoryId', product.get);
router.post('/add', product.add);
router.patch('/update/:productId', product.update);

module.exports = router;
