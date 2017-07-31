let express = require('express');
let path = require('path');
let fs = require('fs');
let debug = require('debug')('admin:blog_service');
let formidable = require('formidable');
let aws = require('aws-sdk');
let config = require('../config');
let router = express.Router();

router.post('/upload', function(req, res, next){
    var form = new formidable.IncomingForm();
  
    form.uploadDir = path.join(__dirname, '../uploads');
    form.parse(req);

    
    var filePromise;
    form.on('file', function(field, file) {
        
        var file_key = Date.now() + '_' + file.name;
        var new_file_path = path.join(form.uploadDir, file_key);
       
        filePromise = new Promise((resolve, reject) => {
            fs.rename(file.path, new_file_path, function(err){
                if(err) reject(err);
                else{

                    aws.config.update({
                        accessKeyId: config.aws.access_key,
                        secretAccessKey: config.aws.access_secret
                    });

                    var fileBuffer = fs.readFileSync(new_file_path);
                    var s3 = new aws.S3();

                    var data = {
                        Bucket: config.aws.bucket,
                        Key: file_key, 
                        Body: fileBuffer,
                        ACL:'public-read',
                        ContentType: file.type 
                    };
                    s3.putObject(data, function(err, data){
                        
                        if (err) reject(err);
                        else{
                            //delete from disk
                            fs.unlink(new_file_path, (err) => {});
                            resolve('https://' + config.aws.bucket + '.s3.amazonaws.com/' + file_key);
                        }

                    });
                }
            }); 
        });
      
    });

    form.on('error', function(err) {
       debug('An error has occured: ' + err);
    });

    form.on('end', function() {
        filePromise.then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send('failed');
        })
    });

});

module.exports = router;