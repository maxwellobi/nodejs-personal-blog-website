var express = require('express');
var async = require('async');
var seneca = require('seneca');
var router = express.Router();

let Category = require('../models/category');
let Blog = require('../models/blog');
let config = require('../config');

router.get('/', 
    function(req, res, next) {
        
       return module.exports.page(req, res, next);
        
});

router.get('/page/:page(\\d+)', 
    module.exports.page = function(req, res, next, params) {
               
        data = {};
        data.title = 'Maxwell Obi';

        if(params == 'subscribed')
            data.scripts = `
                <script>
                    $(document).ready(function(){
                        swal("Thank you for subscribing!", "You will now receive my newsletters on a monthly basis", "success");
                    });
                </script>
                `;

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
        
       req.checkBody('email', 'Email is required').isEmail();
       req.sanitizeBody('email').escape();

       req.getValidationResult()
       .then((validation_result) => {
            if(!validation_result.isEmpty()) return next(validation_result);

            //send to the email microservice
            seneca()
            .client({ port: config.services.email, host: 'localhost', type: 'tcp', pin: 'role:email_service' })
            .act('role:email_service, cmd:save_email', { email: req.body.email}, function(err, result){

                if(err) return next(err);
                    
                else{
                    return module.exports.page(req, res, next, 'subscribed');
                }
            });
       });
        
});

module.exports.route = router;
