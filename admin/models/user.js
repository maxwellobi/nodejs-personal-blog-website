var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;
var User = new Schema({
    email: { type: String, required: true, lowercase: true, trim: true, unique: true},
    first_name: { type: String, required: true, trim: true},
    last_name: { type: String, required: true, trim: true},
    password: { type: String, required: true, trim: true},
    reset_password: { type: Number, default: 0},
    date_created: { type: Date, default: Date.now},
    date_modified: { type: Date, default: Date.now}
});

User.pre('update', function() {
  this.update({},{ $set: { date_modified: Date.now } });
});

User.virtual('fullname').get(function(){
    return this.first_name + ' ' + this.last_name;
});

User.virtual('formatted_date_created').get(function(){
    return moment(this.date_created).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('User', User);