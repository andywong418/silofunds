var express = require('express');
var admin = require('../controllers/admin');
var admin_mc = require('../controllers/admin-mc');
var router = express.Router();

router.get('/', admin.index);
router.get('/funds', admin.funds);
router.get('/new', admin.new);
router.post('/', admin.create);
router.get('/:id/edit', admin.edit);
router.post('/:id/edit', admin.update);
router.post('/:id/destroy', admin.destroy);
router.post('/upload', admin.upload);
router.post('/sync', admin.sync);
router.post('/new/validate', admin.validate);
router.post('/download', admin.download);
router.get('/migrations', admin.migrations);
router.get('/migrateUp?*', admin.migrateUp);
router.get('/migrateDown', admin.migrateDown);

router.get('/mc-list', admin_mc.index);
router.get('/mc-list/:id', admin_mc.view);

router.get('/organisations', admin.organisations.index);
router.get('/organisations/new', admin.organisations.new);
router.post('/organisations', admin.organisations.create);
router.get('/organisations/:id/edit', admin.organisations.edit);
router.post('/organisations/:id/edit', admin.organisations.update);
router.post('/organisations/:id/destroy', admin.organisations.destroy);
router.post('/organisations/download', admin.organisations.download);

module.exports = router;
