var mongoose = require('mongoose');

var companySchema = mongoose.Schema({
	//
},
{
	timestamps: true
});



module.exports = mongoose.model('Company', companySchema);