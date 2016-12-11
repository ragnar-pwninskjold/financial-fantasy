var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	//put in stuff
},
{
	timestamps: true
});



module.exports = mongoose.model('User', userSchema);