let mongoose = require('mongoose');
let moment = require('moment');
let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: { type: String, required: true},
    slug: { type: String, unique: true},
    status: { type: String, enum: ['Enabled', 'Disabled'], default: 'Enabled'},
    deleted: { type: Boolean, default: false },
    description: { type: String, trim: true},
    date_created: { type: Date, default: Date.now},
    date_modified: { type: Date, default: Date.now}
});

categorySchema.pre('update', function() {
    this.update({},{ $set: { date_modified: Date.now } });
});

categorySchema.pre('save', function(next) {
    if(!this.slug) this.slug = this.name.trim().toLowerCase().split(' ').join('-');
    next();
});

categorySchema.virtual('formatted_date_modified')
.get(function(){
    return moment(this.publish_date).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('Category', categorySchema);
