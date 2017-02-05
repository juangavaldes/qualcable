var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: { type: String, required: true},
  zip: { type: String, required: true},
  created_at: Date,
  updated_at: Date
});

userSchema.pre('save', function(next) {
  var currentDate = new Date();  
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
  console.log('Provider added!');
});

var Provider = mongoose.model('Provider', userSchema);

module.exports = Provider;