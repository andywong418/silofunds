var express = require('express');
var admin = require('../controllers/admin');
var admin_mc = require('../controllers/admin-mc');
var router = express.Router();

router.get('/', admin.index);
router.get('/new', admin.new);
router.post('/', admin.create);
router.get('/:id/edit', admin.edit);
router.post('/:id/edit', admin.update);
router.post('/:id/destroy', admin.destroy);
router.post('/upload', admin.upload);
router.post('/sync', admin.sync);
router.post('/new/validate', admin.validate);
router.post('/download', admin.download);

router.get('/mc-list', admin_mc.index);
router.get('/mc-list/:id', admin_mc.view);

module.exports = router;
