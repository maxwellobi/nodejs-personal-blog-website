let config = {};

config.port = process.env.WEB_PORT || '4000';

//db settings
config.db = {};
config.db.host = process.env.MONGO_HOST ||  'localhost' ;
config.db.port = process.env.MONGO_PORT || '27017';
config.db.user = process.env.MONGO_USER || 'root';
config.db.pass = process.env.MONGO_PASS || 'chameleon';
config.db.database = process.env.MONGO_DATABASE || 'maxwell_site_db';
config.db.auth_source = process.env.MONGO_AUTHSOURCE || 'admin';


module.exports = config;