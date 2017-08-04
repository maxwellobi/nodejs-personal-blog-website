var express = require('express');
var async = require('async');
var router = express.Router();

let Category = require('../models/category');
let Blog = require('../models/blog');

router.get('/', 
    function(req, res, next) {
        
       return module.exports.page(req, res, next);
        
});

router.get('/page/:page(\\d+)', 
    module.exports.page = function(req, res, next) {
        
        data = {};
        data.title = 'Maxwell Obi';

        data.perPage = perPage = 10;
        var page = (req.params.page ? req.params.page : 1) - 1;

        async.parallel({
            count: (cb) => Blog.count({deleted: false}).exec(cb),
            blogs: (cb) => {
                Blog.find({deleted: false})
                .limit(perPage)
                .skip(perPage * page)
                .sort({date_created: 'desc'})
                .exec(cb)
            }
        }, function(err, result){
            if(err) return next(err);

            data.blogs = result.blogs;
            data.count = result.count;
            data.currentPage = (req.params.page ? req.params.page : 1);

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

router.post('/', 
    function(req, res, next) {
        
       return module.exports.page(req, res, next);
        
});

module.exports.route = router;
