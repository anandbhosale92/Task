const router   = require('express').Router();
const category = require('../../controllers/category');

router.get('/', category.all);
router.post('/add', category.add);

module.exports = router;
