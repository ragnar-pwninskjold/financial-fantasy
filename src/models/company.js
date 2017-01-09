var mongoose = require('mongoose');

var companySchema = mongoose.Schema({
	ticker: String,
	name: String,
	price: Number,
	ratios: [Number],
	change: Number,
	sector: String
	//add others here

},
{
	timestamps: true
});



module.exports = mongoose.model('Company', companySchema);