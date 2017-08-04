let config = {};

//db settings
config.db = {};
config.db.host = process.env.MONGO_HOST ||  'localhost' ;
config.db.port = process.env.MONGO_PORT || '27017';
config.db.user = process.env.MONGO_USER || 'root';
config.db.pass = process.env.MONGO_PASS || 'chameleon';
config.db.database = process.env.MONGO_DATABASE || 'maxwell_site_db';
config.db.auth_source = process.env.MONGO_AUTHSOURCE || 'admin';

//Microservices config
config.services = {};
config.services.web = process.env.WEB_PORT || '3000';
config.services.admin = process.env.MAIN_SERVICE_PORT || '4000';
config.services.email = process.env.EMAIL_SERVICE_PORT || '5000';
config.services.blog = process.env.BLOG_SERVICE_PORT || '6000';
config.services.blog_host = process.env.BLOG_SERVICE_HOST || 'http://localhost:6000';

module.exports = config;