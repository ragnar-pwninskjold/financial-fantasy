const user = require('./models/user.js');
const company = require('./models/company.js');
const contest = require('./models/contest.js');



module.exports = function(app) {

	app.get('/foofoo', function(req, res) {
		res.json("foooooooo");
	});

}