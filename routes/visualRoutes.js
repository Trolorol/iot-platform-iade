var express = require('express');
var router = express.Router();
// Screen Routes 
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Expressx' });
});

module.exports = router;