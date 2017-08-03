let mongoose = require('mongoose');
let moment = require('moment');
let Schema = mongoose.Schema;

let blogSchema = new Schema({
    title: { type: String, required: true, trim: true},
    slug: { type: String, lowercase: true, unique: true},
    category: { type: Schema.ObjectId, ref: 'Category', required: true },
    header_image: { type: String},
    content: { type: String, required: true },
    tags: [{type: String}],
    status: {type: String, enum: ['Enabled', 'Disabled'], default: 'Enabled'},
    deleted: { type: Boolean, default: false },
    publish_date: { type: Date, default: Date.now},
    date_created: { type: Date, default: Date.now},
    date_modified: { type: Date, default: Date.now}
});

blogSchema.pre('update', function() {
  this.update({},{ $set: { date_modified: Date.now } });
});

blogSchema.pre('save', function(next) {
  
  if(!this.slug){
    this.slug = this.title.trim().toLowerCase().split(' ').join('-');
  }else this.slug = this.slug.trim().toLowerCase().split(' ').join('-');

  next();

});

blogSchema.virtual('pubdate')
.get(function(){
    return moment(this.publish_date).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('Blog', blogSchema);