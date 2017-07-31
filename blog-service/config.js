let config = {};

//app settings
config.app_secret = process.env.APP_SECRET || '2max-abh4-6k10-5hjx-8gks';

//db settings
config.db = {};
config.db.host = process.env.MONGO_HOST ||  'localhost' ;
config.db.port = process.env.MONGO_PORT || '27017';
config.db.user = process.env.MONGO_USER || 'root';
config.db.pass = process.env.MONGO_PASS || 'chameleon';
config.db.database = process.env.MONGO_DATABASE || 'maxwell_site_db';
config.db.auth_source = process.env.MONGO_AUTHSOURCE || 'admin';

//redis settings
config.redis = {};
config.redis.host = process.env.REDIS_HOST || '127.0.0.1';
config.redis.port = process.env.REDIS_PORT || '6379';

//Microservices config
config.services = {};
config.services.main_host = process.env.MAIN_HOST || 'http://localhost:3000';
config.services.main = process.env.MAIN_SERVICE_PORT || '3000';
config.services.email = process.env.EMAIL_SERVICE_PORT || '6000';
config.services.blog = process.env.ARTICLE_SERVICE_PORT || '7000';

config.aws = {};
config.aws.bucket = process.env.AWS_BUCKET;
config.aws.access_key = process.env.AWS_ACCESS_KEY;
config.aws.access_secret = process.env.AWS_ACCESS_SECRET;


module.exports = config;