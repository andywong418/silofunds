var express = require('express');
var edit = require('../controllers/user-edit');
var router = express.Router();
var multer = require('multer');
var upload = multer();

router.post('/add-work', upload.single('file'), edit.addWork);

module.exports = router; 