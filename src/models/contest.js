var mongoose = require('mongoose');

var contestSchema = mongoose.Schema({
	title: String,
	buyIn: Number,
	startDate: Date,
	endDate: Date,
	participantCount: Number,
	prizeTotals: Number,
	prizes: [{}],
	leaderBoard: [{}],
	status: String,
	contestType: String,
	contestants: [{}],
	contestantsLength: Number,
	requestingUser: String
	
},
{
	timestamps: true
});



module.exports = mongoose.model('Contest', contestSchema);