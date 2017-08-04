let express = require('express');
let moment = require('moment');
let async = require('async');
let config = require('../config');
let Category = require('../models/category');
let Blog = require('../models/blog');

let router = express.Router();

router.get('/all', 
  function(req, res){
  
    let data = {};
    let msg = req.flash('msg');
    if(msg.length > 0){
        data.message = msg[0];
        data.type = 'primary';
    }

    Blog.find({deleted: false})
    .populate('category')
    .sort({date_created: 'desc'})
    .exec((err, blogs) => {
        
      if(err) next(err);
      data.blogs = blogs;

      res.render('blog_all', data);

    });

});

router.get('/:id/delete', 
    (req, res, next) => {

        req.sanitizeParams('id').escape();

        let _id = req.params.id;
        Blog.findByIdAndUpdate(_id, {deleted: true})
        .then((blog) => {
            
          if(blog) res.json({ title: 'Deleted!', msg: 'Blog has been deleted successfully', status: 'success' });

        })
        .catch((err) => {
            res.json({ title: 'Error!', msg: 'Blog could not be deleted ' + err, status: 'error'});
        });
    }
);

router.get('/:id/:action', 
    (req, res, next) => {

        req.sanitizeParams('id').escape();
        req.sanitizeParams('action').escape();

        if(req.params.action !== 'enabled' && req.params.action !== 'disabled') 
            return next(); //would result in 404

        let _ = require('lodash');
        let blog_id = req.params.id;
        let newstatus = _.upperFirst(req.params.action);
        Blog.findByIdAndUpdate(blog_id, {status: newstatus}, function(err, doc){
            if(err) return next(err);
            else{
                req.flash('msg', 'Blog ' +newstatus   + ' Successfully');
                return res.redirect('/blogs/all');
            }
        });

    }
);

router.get('/:id?', 
  function(req, res, next) {

    context = {};
    context.blog = {};
    context.publish_date = moment().format('MMM D, YYYY');
    context.csrfToken = req.csrfToken();

    async.parallel({

      blog: (callback) => {
        if(req.params.id) Blog.findById(req.params.id, callback);
        else callback(null, {});
      },
      categories: (callback) => {  Category.find({deleted: false, status: 'Enabled'}, '_id name', callback);  }

    }, function(err, result){

      if(err) next(err);
      else{

        if(result.blog)
          context.publish_date = moment(result.blog.publish_date).format('MMM D, YYYY');

        context.categories = result.categories;
        context.blog = result.blog
        res.render('blog', context);
      }

    });
    
  }
);

router.post('/:id?', 
  function(req, res, next) {

    req.checkBody('title', 'Title of the article is required').notEmpty();
    req.checkBody('content', 'Post cannot be empty').notEmpty();
    req.checkBody('category', 'Category must be selected').notEmpty();
    req.checkBody('pubdate', 'Publish date is required or in invalid format').notEmpty().isDate();
   
    req.sanitizeBody('title').escape();
    req.sanitizeBody('category').escape();
    req.sanitizeBody('pubdate').escape();
    req.sanitizeBody('pubdate').toDate();
    req.sanitizeBody('tags').escape();
    //req.sanitizeBody('header_image').escape();

    context = {};
    context.csrfToken = req.csrfToken();

     //get the list of categories again for display
    Category.find({deleted: false, status: 'Enabled'}, '_id name', (err, categories) => {
      if(err) next(err);
      else context.categories = categories;
    });

     //Post is good - now save to db
    
    context.blog = blog = new Blog({
      title: req.body.title,
      slug: req.body.slug,
      category: req.body.category,
      header_image: req.body.header_image,
      content: req.body.content,
      tags: req.body.tags.split(','),
      publish_date: req.body.pubdate
    });

    context.publish_date = moment(blog.publish_date).format('MMM D, YYYY');
    if(req.params.id) blog._id = req.params.id;

    req.getValidationResult()
    .then((validation_result) => {

      if(!validation_result.isEmpty()){ //there is error

        context.message = validation_result.useFirstErrorOnly().array()[0].msg;
        context.type = 'danger'; 
        return res.render('blog', context);
      }

      if(req.params.id){
        
        Blog.findByIdAndUpdate(req.params.id, blog, (err, document) => {
        
          if(err){
            
            context.message = 'Error updating article - ' + err;
            context.type = 'danger'; 
            return res.render('blog', context);
          }
          
          req.flash('msg', 'Your new article was updated successfully');
          res.redirect('/blogs/all')

        });

      }else {

        blog.save()
        .then((blog) => {
            
          req.flash('msg', 'Your new article was successfully created');
          res.redirect('/blogs/all')
        })
        .catch((err) => {
            context.message = 'Error saving article - possible duplicate slug';
            context.type = 'danger'; 
            return res.render('blog', context);
        });
          
      }//end if edit id exists


    }); //end vlidation check
    
});


module.exports = router;
