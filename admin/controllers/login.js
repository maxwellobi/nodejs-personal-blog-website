let express = require('express');
let debug = require('debug')('admin:login');
let stringify = require('json-stringify-safe');
let User = require('../models/user');
let encryption = require('../core/encryption');

var router = express.Router();

router.get('/', 
     function(req, res, next){   

        //check if remember me cookie exists
        if(req.cookies.max_re){
            
            //remeber me and auto log in
            let encrypted_credentials = req.cookies.max_re;
            let clear_credentials = encryption.aes_decrypt(encrypted_credentials);
            let user = JSON.parse(clear_credentials);

            debug('User retrieved from cookie: ' + clear_credentials);

            check_user(user)
            .then((userObj) => {

                debug('User Auto logged');
                
                req.session.user = userObj;
                req.session.logged_in = true;
                return res.redirect('/sudo/dashboard');

            }).catch((err) => { return res.render('login', { layout: false, csrfToken: req.csrfToken(), email: req.body.email, errors: error }); });

        }
        
       else{
           
           var data = { layout: false, csrfToken: req.csrfToken() };

           var msg = req.flash('msg');
           var err = req.flash('error');

           if(err.length > 0) data.errors = err[0];
           else if(msg.length > 0){
               data.errors = msg[0];
               data.type = 'success';
           }

           res.render('login', data);
           return;
       }
    }
);

router.post('/', 
    function(req, res, next){
        
        //validate posted info
        req.checkBody('email', 'Email is required or is invalid email format').isEmail();
        req.checkBody('password', 'Password is required').notEmpty();

        //cleanup data
        req.sanitizeBody('email').escape();
        req.sanitizeBody('password').escape();
        req.sanitizeBody('remember').escape();

        var userCredentials = { 
            email: req.body.email, 
            password: req.body.password 
        };

        req.getValidationResult()
        .then(function(result){
            if(!result.isEmpty()){

                let util = require('util');
                let errors = result.useFirstErrorOnly().array();
                debug('Validation Error: ' +  util.inspect(errors));

                return res.render('login', { layout: false, csrfToken: req.csrfToken(), email: req.body.email, errors: errors });
            }

            //no validation errors - perform login - use JWT for APIs
            userCredentials.password = encryption.hash256(userCredentials.password);
            check_user(userCredentials)
            .then((user) => {

                //save session in redis
                req.session.user = user;
                req.session.logged_in = true;

                let util = require('util');
                debug(`Login successful and Session Saved to redis: ${util.inspect(user)}`);

                //set remember me details
                if(req.body.remember === 'on'){
                    user = stringify(userCredentials, null, 2);
                    res.cookie('max_re', encryption.aes_encrypt(user), { maxAge: 604800 });
                } 

                return res.redirect('/sudo/dashboard');
            })
            .catch((error) => {
                
                debug('Login failed: ' + JSON.stringify(error));
                return res.render('login', { layout: false, csrfToken: req.csrfToken(), email: req.body.email, errors: error });                
            });
          
            
        });


    }
);

router.get('/logout', 
    function(req, res, next){

        req.session.destroy();
        
        //clear remember me cookie
        res.clearCookie('max_re');
        res.cookie('max_re', '', {  expires: new Date() });
        
        res.redirect('/');
    }
);

router.post('/check_logged_in', 
    module.exports.check_logged_in = function(req, res, next){
        if(req.session.user && req.session.logged_in) next();        
        else res.redirect('/');
    }
);

let check_user = (userObject) => {
    
    debug('Login details: ' + JSON.stringify(userObject));

    return new Promise(function(resolve, reject){
        User.findOne(userObject)
        .then((user) => {

            if(user){
                debug('Logged In');
                resolve(user);
            }
            else reject('Invalid Credentials');
        });
    });
    
};

module.exports.router = router;