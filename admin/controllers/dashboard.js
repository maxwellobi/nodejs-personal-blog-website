let express = require('express');
let debug = require('debug')('admin:dashboard');
var router = express.Router();

router.get('/dashboard', 
    (req, res, next) => {

        let data = {};
        data.title = 'Dashboard';

        res.render('dashboard', data);
    }
);

module.exports = router;