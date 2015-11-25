var express = require('express');
var admin = require('../controllers/admin');
var router = express.Router();

router.get('/', admin.index);
router.get('/new', admin.new);
router.post('/', admin.create);
router.get('/:id/edit', admin.edit);
router.post('/:id/edit', admin.update);
router.post('/:id/destroy', admin.destroy);
router.post('/upload', admin.upload);

module.exports = router;
