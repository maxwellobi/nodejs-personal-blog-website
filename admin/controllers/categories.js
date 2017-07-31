let express = require('express');
let async = require('async');
let debug = require('debug')('admin:categories');
let Category = require('../models/category');
let router = express.Router();

let title = 'Categories';
let styles = '<link href="/plugins/footable/footable.css" rel="stylesheet">';
    styles += '<link href="/plugins/sweetalert/sweetalert.css" rel="stylesheet">';

let scripts = '<script src="/plugins/footable/footable.min.js"></script>';
    scripts += '<script src="/plugins/footable/footable-init.js"></script>';
    scripts += '<script src="/plugins/sweetalert/sweetalert.min.js"></script>';
    scripts += '<script src="/plugins/sweetalert/sweetalert-init.js"></script>';

router.get('/categories', 
    (req, res, next) => {

        let data = {};
        data.title = title;
        data.styles = styles;
        data.scripts = scripts;
        data.csrfToken = req.csrfToken();
        
        let msg = req.flash('msg');
        let err = req.flash('err');
        if(msg.length > 0){
            data.message = msg[0];
            data.type = 'success';
        }
        else if(err.length > 0){
            data.message = err[0];
            data.type = 'error';
        }

        Category.find({ deleted: false })
        .then((result) => {

            data.categories = result;
            res.render('categories', data);
        })
        .catch((err) => next(err));

    }
);

router.get('/categories/:id/update', 
    (req, res, next) => {
        req.sanitizeParams('id').escape();

        let data = {};
        data.title = title;
        data.styles = styles;
        data.scripts = scripts;
        data.csrfToken = req.csrfToken();

        async.parallel({
            all_category: (callback) => {
                Category.find({ deleted: false }, callback);
            },
            current_category: (callback) => {
                Category.findOne({ _id: req.params.id, deleted: false }, callback);
            }
        }, function(err, result){
            if(err){
                req.flash('err', 'Category could not be retrieved - ' + err);
                return res.redirect('/sudo/categories');
            }
            else{

                if(!result.current_category){
                    req.flash('err', 'Category could not found - ' + err);
                    return res.redirect('/sudo/categories');
                }

                data.categories = result.all_category;
                data.category = result.current_category;
                data.scripts += `
                        <script>
                            $(document).ready(function(){
                                $('#category-modal').modal('show');
                            });
                        </script>`;
                return res.render('categories', data);
            }
        });

    }
);

router.get('/categories/:id/delete', 
    (req, res, next) => {

        req.sanitizeParams('id').escape();

        let category_id = req.params.id;
        async.parallel([
            //delete the category
            (callback) => { 
                Category.findByIdAndUpdate(category_id, {deleted: true}, callback) 
            },

            // //delete all articles tied to that category
            // (callback) => { 
            //     Category.updateMany({ category: category_id }, {deleted: true}, callback) 
            // }

        ], function(err, result){

            if(err) res.json({ title: 'Error!', msg: 'Category could not be deleted ' + err, status: 'error'});
            else{
                res.json({ title: 'Deleted!', msg: 'Category has been deleted successfully', status: 'success' });
            }
        });
    }
);

router.get('/categories/:id/:action', 
    (req, res, next) => {

        req.sanitizeParams('id').escape();
        req.sanitizeParams('action').escape();

        if(req.params.action !== 'enabled' && req.params.action !== 'disabled') 
            return next();

        let _ = require('lodash');
        let category_id = req.params.id;
        let newstatus = _.upperFirst(req.params.action);
        Category.findByIdAndUpdate(category_id, {status: newstatus}, function(err, doc){
            if(err) return next(err);
            else{
                req.flash('msg', 'Category ' + _.upperFirst(req.params.action) + ' Successfully');
                return res.redirect('/sudo/categories');
            }

        });

    }
);

router.post('/categories/:id/update', 
    (req, res, next) => {
        return module.exports.save_update_category(req, res, next);
    }
);

router.post('/categories', 
    module.exports.save_update_category = (req, res, next) => {

        let data = {};
        data.title = title;
        data.styles = styles;
        data.scripts = scripts;
        data.csrfToken = req.csrfToken();

        //validate data
        req.checkBody('name', 'Category name is required').notEmpty();
        req.checkBody('description', 'Description is required').notEmpty()
        req.checkBody('description', 'Description must be less that 150 chars').len(1, 150);;
        
        req.sanitizeBody('name').escape();
        req.sanitizeBody('slug').escape();
        req.sanitizeBody('description').escape();

        let category = new Category({ 
            name: req.body.name, 
            slug: req.body.slug, 
            description: req.body.description
        });
        
        if(req.params.id) category._id = req.params.id;
        
        req.getValidationResult()
        .then((validation_result) => {

            var responsePromise = new Promise(
                function(resolve, reject){
                    if(!validation_result.isEmpty()){ //there are validation errors

                        data.type = 'error';
                        data.notification = validation_result.useFirstErrorOnly().array();
                        data.category = category;
                        data.scripts += `
                        <script>
                            $(document).ready(function(){
                                $('#category-modal').modal('show');
                            });
                        </script>`;

                        debug('validation error happened ' + validation_result.array());

                        reject(data);

                    }else{
                        
                        
                        debug('all data is fine');

                        //save the posted data - set flash notification and redirect to /get
                        var cb = function(err){

                            if(err){
                                 
                                debug('Error saving record ' + err);
                                data.notification = 'Error saving record - check duplicate slug';
                                data.type = 'error';
                                data.scripts += `
                                <script>
                                    $(document).ready(function(){
                                        $('#category-modal').modal('show');
                                    });
                                </script>`;

                                reject(data);

                            }else{
                                
                                req.flash('msg', 'A new category was successfully created');
                                resolve();
                            }
                                
                        }//end save;

                        //save or update
                        if(req.params.id) Category.findByIdAndUpdate(req.params.id, category, cb);
                        else category.save(cb);
                    }
                }

            ); // promise

            responsePromise
            .then(() => res.redirect('/sudo/categories'))
            .catch((err_data) => {

                    //err_data contains all previous data from top thread before entering  asyn
                    Category.find({ deleted: false }, function(err, result){
                        err_data.categories = result;
                        err_data.category = category;
                        return res.render('categories', err_data);
                    })
                }
            );

        });
    }
);

module.exports = router;