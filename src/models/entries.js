var mongoose = require('mongoose');

var entriesSchema = mongoose.Schema({
	userId: String,
	contestId: String,
	balance: {type: Number, default: 5000},
	contestOpen: Boolean
	//add others here

},
{
	timestamps: true
});



module.exports = mongoose.model('Entries', entriesSchema);