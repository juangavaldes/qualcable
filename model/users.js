var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: { type: String, required: true},
  last_name: { type: String, required: true},
  username: { type: String, required: true},
  password: { type:String ,required:true},
  created_at: Date,
  updated_at: Date,
  email: { type:String ,required:true}
});

userSchema.pre('save', function(next) {
  var currentDate = new Date();  
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
  console.log('User created!');
});

var User = mongoose.model('User', userSchema);

module.exports = User;