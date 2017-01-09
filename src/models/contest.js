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
	contestants: [String] //each contestant should have cash value for this contest
	//use the default ObjectId as the unique identifier
},
{
	timestamps: true
});



module.exports = mongoose.model('Contest', contestSchema);