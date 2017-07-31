let express = require('express');
let qs = require('querystring');
let debug = require('debug')('admin:resetpassword');
let User = require('../models/user');
let encryption = require('../core/encryption');

let router = express.Router();

router.get('/resetpassword/:encrypted_email', 
    function(req, res, next){

        debug('GET: /Reset Password with param => ' + req.params.encrypted_email);
        if(!req.params.encrypted_email) return next();

        let data = {};
        data.layout = false;
        data.title = 'Reset Password';

        try{
            let decrypted_email = encryption.aes_decrypt(qs.unescape(req.params.encrypted_email));
            debug('Decrypted email param => ' + decrypted_email);

            let user_data = {};
            user_data.email = data.email = decrypted_email;
            user_data.reset_password = 1;

            User.findOne(user_data)
            .then((user) => {
                if(user){

                    data.user = user;
                    data.csrfToken = req.csrfToken();
                    res.render('resetpassword', data);

                }else{

                    debug('No user found with that email');
                    data.errors = 'User account could not be found';
                    data.invalid_token = true;
                    res.render('resetpassword', data);
                }
            })
            .catch((err) => { return next(err) } );
        }
        catch(error){
            
            debug('Error occurred while decrypting => ' + error);
            data.invalid_token = true;
            return res.render('resetpassword', data);
        }
    }
);

router.post('/resetpassword/:encrypted_email', 
    function(req, res, next){
        if(!req.params.encrypted_email) return next();

        let data = {};
        data.layout = false;
        data.title = 'Reset Password';
        data.csrfToken = req.csrfToken();
        try{
            let decrypted_email = encryption.aes_decrypt(qs.unescape(req.params.encrypted_email));
        }catch(err){  

            debug('Could not decrypt param');
            data.invalid_token = true;
            res.render('resetpassword', data);
            return;
        }

        req.checkBody('newpassword', 'Password must have 6 to 20 characters').len(6, 20);
        req.sanitizeBody('newpassword').escape();

        req.getValidationResult()
        .then((result) => {

            //error
            if(!result.isEmpty()){
                debug('validation error in reset operation');
                data.errors = result.array();
                res.render('resetpassword', data);
                return;
            }

            //check if password is same as confirm
            if(req.body.newpassword !== req.body.confirmpassword){
                data.errors = 'Password does not match confirm';
                res.render('resetpassword', data);
                return;
            }

            //data is valid
            let hashed_password = encryption.hash256(req.body.newpassword)
            User.findByIdAndUpdate(req.body._userid, {reset_password: 0, password: hashed_password},
             function(err, user){
                if(err){
                    debug('could not update user ' + err);
                    req.flash('error', 'There was a problem resetting your password - please try again later')
                    res.redirect('/');
                    return;
                }

                debug('User password was successfully updated');
                req.flash('msg', 'Password reset successful - proceed to login');
                res.redirect('/');
            });

        });

    }
);

router.get('/resetlink', 
    (req, res) => { res.redirect('/') 
});

router.post('/resetlink', 
     function(req, res, next){

        //run validation
        req.checkBody('reset_email', 'Email not specified or not in valid format').isEmail();
        req.sanitizeBody('reset_email').escape();

        let data = {};
        data.email = req.body.reset_email;
        req.getValidationResult().then((result) => {

            if(!result.isEmpty()){
                 res.render('login', { layout: false, csrfToken: req.csrfToken(), display_reset_view: true, errors: result.array() });
                 return;
            }

            let stringify = require('json-stringify-safe');
            debug('Data => ' + stringify(data));
            //posted data is valid - check if email exist and update the reset password flag
            User.findOneAndUpdate(data, {reset_password: 1}, (err, result) => {

                if(err || !result){
                    debug('Error => ' + err);
                    return res.render('login', { layout: false, csrfToken: req.csrfToken(), display_reset_view: true, errors: 'Specified email not found' });
                }
                else{
                    
                    debug(`User to reset password ${stringify(result)} `);

                    //send reset password link to email
                    var encrypted_email = encryption.aes_encrypt(data.email);

                    encrypted_email = qs.escape(encrypted_email);
                    var reset_password_url = req.protocol + '://' + req.get('host') + '/resetpassword/' + encrypted_email;
                    debug('Reset link => ' + reset_password_url);

                    //fire email microservices
                    let helpers = require('../core/helpers');
                    let config = require('../config');
                    let seneca = require('seneca');

                    req.session.service_session = result;

                    data = {};
                    data.sessionid = req.session.id;
                    data.receiver_email = result.email;
                    data.receiver_name = result.fullname;
                    data.subject = 'Reset your password';
                    data.body = 'Hello ' + helpers.ucFirst(result.first_name) + ', <br/><br/>'
                                + 'Use the link below to reset your password. <br/> ' + reset_password_url + '<br/><br/>'
                                + 'Kindly ignore this email if you did not request a passord rest. <br/><br/>'
                                + 'Best regards.';
                    
                    //communicate to the email micro service
                    debug('Send to email micro service => ' + stringify(data));
                    
                    seneca()
                    .client({ port: config.services.email, host: 'localhost', type: 'tcp', pin: 'role:email_service' })
                    .act('role:email_service, cmd:send_email', data, function(err, result){

                        var msg = {};
                        msg.layout = false;
                        msg.csrfToken = req.csrfToken();
                        msg.display_reset_view = true;

                        if(err){
                            
                            debug('Email micro service returned error ' + err);
                            msg.errors = 'Email not sent - Service might be temporarily unavailable';
                            res.render('login', msg);
                            
                            return;

                        }else{
                             
                           debug('Received from email micro service' + result);
                           
                           msg.errors = 'Reset password link sent successfully';
                           msg.type = 'success';
                           res.render('login', msg);

                           return;
                        }
                    });
                    
                }

            });

        });

    }
);

module.exports = router;