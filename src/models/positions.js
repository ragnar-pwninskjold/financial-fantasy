var mongoose = require('mongoose');

var positionSchema = mongoose.Schema({
	position: [{}],
	userId: String,
	contestId: String,
	isOpen: Boolean
},
{
	timestamps: true
});



module.exports = mongoose.model('Position', positionSchema);

/*

	user {_id,email,username,cash_balance}
	contest {_id,num_players,title,buy_in,entries[],creator}
	entry {_id,contest_id,user_id,cash_balance,positions[],value}
	position {_id,entry_id,stock,volume,value}

*/