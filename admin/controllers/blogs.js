let express = require('express');
let config = require('../config');
let router = express.Router();


router.get('/blogs', 
    (req, res, next) => {
        res.render('blogs', { 
            title: 'My Blogs/Rants', 
            article_service_url: config.services.blog_host + '/blogs/all'
        });
    }
);

module.exports = router;