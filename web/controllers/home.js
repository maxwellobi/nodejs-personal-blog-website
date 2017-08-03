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
        .sort({date_created: 'asc'})
        .exec((err, blogs) => {

            if(err) next(err);
            data.blogs = blogs;

            //res.json(data);
            res.render('home', data);
        });
        
});

module.exports = router;
