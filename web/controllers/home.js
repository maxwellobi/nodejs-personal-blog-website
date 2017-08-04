var express = require('express');
var router = express.Router();

let Category = require('../models/category');
let Blog = require('../models/blog');

router.get('/', 
    function(req, res, next) {
        
        data = {};
        data.title = 'Maxwell Obi';

        Blog.find({deleted: false})
        .populate('category')
        .sort({date_created: 'desc'})
        .exec((err, blogs) => {

            if(err) next(err);
            data.blogs = blogs;

            res.render('home', data);
        });
        
});

router.get('/about', 
    function(req, res, next) {

        res.render('about', { title: 'About Maxwell Obi'});
});

router.get('/contact', 
    function(req, res, next) {

        res.render('contact', { title: 'Maxwell Obi\'s Contact'});
});

module.exports = router;
