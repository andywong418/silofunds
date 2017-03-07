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
router.post('/funds/reset-table', admin.resetTable);
router.post('/test-search', admin.testSearch);
router.get('/test-search', admin.testSearchCheck);
router.post('/update-relevance', admin.updateRelevance);
router.get('/check-precision', admin.testPrecision);
router.get('/freshers-signup', function(req, res){
  res.render('admin/freshers-signup');
});
router.post('/freshers-signup', admin.fresherSignup);
router.get('/mc-list', admin_mc.index);
router.get('/mc-list/:id', admin_mc.view);

router.get('/stripe', admin.stripe.index);
// router.post('/stripe/:id/destroy', admin.stripe.destroy);

router.get('/organisations', admin.organisations.index);
router.get('/organisations/new', admin.organisations.new);
router.post('/organisations', admin.organisations.create);
router.get('/organisations/:id/edit', admin.organisations.edit);
router.post('/organisations/:id/edit', admin.organisations.update);
router.post('/organisations/:id/destroy', admin.organisations.destroy);
router.post('/organisations/download', admin.organisations.download);
router.post('/organisations/upload', admin.organisations.upload);
router.post('/organisations/reset-table', admin.organisations.resetTable);

router.get('/jobs', admin.jobs.index);
router.get('/jobs/new', admin.jobs.new);
router.post('/jobs', admin.jobs.create);
router.get('/jobs/:id/edit', admin.jobs.edit);
router.post('/jobs/:id/edit', admin.jobs.update);
router.post('/jobs/:id/destroy', admin.jobs.destroy);

router.get('/analytics', admin.analytics.index);
router.get('/analytics/seg_uk', admin.analytics.seg_uk);
router.get('/analytics/seg_colleges', admin.analytics.seg_colleges);
router.get('/analytics/seg_subjects', admin.analytics.seg_subjects);
router.get('/analytics/param_seg_pd', admin.analytics.param_seg_pd);

module.exports = router;
