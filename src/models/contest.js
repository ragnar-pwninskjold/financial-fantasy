var mongoose = require('mongoose');

var contestSchema = mongoose.Schema({
	//contest stuff
},
{
	timestamps: true
});



module.exports = mongoose.model('Contest', contestSchema);