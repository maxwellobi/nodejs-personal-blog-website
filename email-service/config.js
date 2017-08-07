 let config = {};

 config.app_name = 'Email Microservice';

//sendGrid email config
config.email = {};
config.email.send_from_email = 'hello@maxwellobi.com';
config.email.send_from_name = 'MaxwellObi.Com';
config.email.sendgrid_api_key = process.env.SENDGRID_KEY;

config.redis = {};
config.redis.host = process.env.REDIS_HOST || '127.0.0.1';
config.redis.port = process.env.REDIS_PORT || '6379';

//microservices config
config.services = {};
config.services.admin = process.env.ADMIN_SERVICE_PORT || '4000';
config.services.email = process.env.EMAIL_SERVICE_PORT || '5000';

module.exports = config;