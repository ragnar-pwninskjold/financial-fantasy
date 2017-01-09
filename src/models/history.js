var mongoose = require('mongoose');

var historySchema = mongoose.Schema({
	userId: String,
	transactionType: String,
	transactionVolume: Number,
	transactionPrice: Number
},
{
	timestamps: true
});



module.exports = mongoose.model('History', historySchema);

//