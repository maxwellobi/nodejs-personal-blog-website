var express = require('express');
var async = require('async');
var router = express.Router();

let Category = require('../models/category');
let Blog = require('../models/blog');

router.get('/:slug', 
    function(req, res, next) {
    
        let slug = req.params.slug;

        Blog.findOne({deleted: false, slug: slug})
        .then((blog) => {

            if(!blog) return next(); //404
            
            data = {};
            data.blog = blog;
            data.title = blog.title;

            //get the previous and next post
            async.parallel({
                
                next_post: (callback) => {
                    Blog.findOne({_id: {$gt: blog._id}, deleted: false}, 'slug title')
                    .sort({_id: 1 })
                    .limit(1)
                    .exec(callback);
                },

                last_post: (callback) => {
                    Blog.findOne({_id: {$lt: blog._id}, deleted: false}, 'slug title')
                    .sort({_id: -1 })
                    .limit(1)
                    .exec(callback);
                }

            }, function(err, result){
                if(err) next(err);

                data.previous_post = result.last_post;
                data.next_post = result.next_post;
                res.render('blog', data);                
            });
            
        })
        .catch((err) => next(err));
        
});

module.exports = router;
