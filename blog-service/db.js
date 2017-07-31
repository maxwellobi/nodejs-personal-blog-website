var mongoose = require('mongoose');
var debug = require('debug')('admin:db');
let config = require('./config');

let connection_string = `mongodb://${config.db.host}:${config.db.port}/${config.db.database}`;
if(config.db.user && config.db.pass) connection_string =  `mongodb://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.database}`;
if(config.db.auth_source) connection_string += `?authSource=${config.db.auth_source}`;

const db = mongoose.connect(connection_string).connection;
db.on('error', console.error.bind(console, 'Database Connection Error: '));

debug('Database Connected');

mongoose.Promise = global.Promise; //use the default promises library for mongoose
module.exports = mongoose;