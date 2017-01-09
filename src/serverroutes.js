const User = require('./models/user.js');
const Company = require('./models/company.js');
const Contest = require('./models/contest.js');
const History = require('./models/history.js');
const Position = require('./models/positions.js');
const Entries = require('./models/entries.js');

const cookie = require('react-cookie');
const jwtDecode = require('jwt-decode');
const axios = require('axios');
const CronJob = require('cron').CronJob;

const csv = require('csvtojson');
const download = require('download-file');


module.exports = function(app) {

	let date = new Date();
	let day = date.getDay();
	let hour = date.getHours();
	let minutes = (date.getMinutes())/60;
	let hourMin = minutes+hour;

	/*

	CRON JOBS SECTION:
	1. One Cron job to update prices, runs every 15 minutes mon-fri 9:30-4
	2. One Cron job to turn pending contests to actively ongoing, which is 9:30 AM, Mon-Fri
	3. One Cron job to turn all pending contests which are untradeable, to tradeable
	4. One cron job to turn active contests to closed
	5. One Cron job to update all leaderboards
	6. One Cron job to turn off all active positions at end of contest

	*/

	var priceUpdate = new CronJob('*/15 * * * *', function(){
		console.log('cron job running every 15 mins, mon-fri 9:30 - 4');
		if ((day != 0 || 6) && (hourMin >= 9.5 && hour < 16)){
			updateNYSE();
			updateNASDAQ();
		}

	}, false);

	var makeActive = new CronJob('00 30 09 * * 1-5', function(){
		//turns on all contests to active
		console.log('cron job running at 9:30 am monday through friday to turn on contests');
		Contest.update({status: 'pending_but_can_make_trades'}, {$set: {status: 'active'}}, {multi: true},function(err, data) {
			if (err) {
				console.log("errors in turning all contests active----", err);
			}
		});

	}, false);

	var makeTradeable = new CronJob('00 15 16 * * 1-5', function(){
		//turns on all contests to active
		console.log('cron job running at 4:15 monday through friday to make untradeable contests tradeable (it was opened during trading hours)');
		Contest.update({status: 'pending_but_cannot_make_trades'}, {$set: {status: 'pending_but_can_make_trades'}}, {multi: true},function(err, data) {
			if (err) {
				console.log("errors in turning all pending untradeable contests to tradeable----", err);
			}
		});

	}, false);

	var closeActive = new CronJob('00 05 16 * * 1-5', function(){
		//turns on all contests to active
		console.log('cron job running at 4:05 monday through friday to make untradeable contests tradeable (it was opened during trading hours)');
		Contest.update({status: 'active'}, {$set: {status: 'closed'}}, {multi: true},function(err, data) {
			if (err) {
				console.log("errors in turning all active to closed----", err);
			}
		});

	}, false);

	//update leaderboard cron job
	//switch all positions to closed cron job

	priceUpdate.start();
	makeActive.start();
	makeTradeable.start();
	closeActive.start();
	//updateleaderboard start();
	//close positions start();

	app.post('/api/contests/:contestid/buy/:stock', function(req, res) {
		let contest = req.params.contestid;
		let stock = req.params.stock;
		console.log("contest-------", contest);
		console.log("stock---------", stock);
		console.log("req--------", req.body);
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;

		Entries.find({ $and: [{userId: userId}, {contestOpen: true}, {contestId: contest}]}, function(err, data) {
			console.log("Entries data", data);
			var balance = data[0].balance;
			if (!err) {
				Company.findOne({ticker: stock}, function(err, data) {
					let price = data.price;
					console.log("volume", req.body.volume);
					console.log("price", price);
					console.log("value", (price*req.body.volume));
					let value = price*req.body.volume;
					
					if (!err) {
						if (balance-value >=0) {
							Position.create({
								position: {
									price: price,
									volume: req.body.volume, 
									value: price*req.body.volume,
									name: stock
								},
								isOpen: true,
								userId: userId,
								contestId: contest
							}, function(err, data) {
								var newBalance = balance - value;
								Entries.findOneAndUpdate({$and: [{userId: userId}, {contestOpen: true}, {contestId: contest}]}, {balance: newBalance}, function(err, data) {
									console.log("err in updating entry balance--------", err);
									res.json("success");
								});
							});
						}
						else {
							res.json("NOT_ENOUGH_FUNDS");
						}
						
					}
					else {
						console.log("err in company.findone--------", err);
						return;
					}
				});
			}
			else {
				console.log("there was an error in finding company", err);
				res.json(err);
			}
			
		});

		

		
		

	});

	app.get('/api/contests/active', function(req, res) {
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		console.log("user id", userId);
		Contest.find({ $and: [{'contestants': userId}, {status: 'active'}]}, function(err, data) {
			res.json(data);
		});
	});

	app.post('/api/entry/:contest', function(req, res) {
		console.log(req.params);
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		let contestId = req.params.contest;
		Entries.create({
			userId,
			contestId,
			contestOpen: true
		}, function(err, data) {
			console.log("err in entry create------", err);
		});
		Contest.update({'_id': contestId}, {$push: {contestants: userId}}, function(err, data) {
			console.log("err in pushing user to contest----", err);
			console.log("data from pushing to user to contest----", data);
		});
	});

	app.get('/api/contests/:contest/positions', function(req, res) {
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		let contest = req.params.contest;
		Position.find({ $and: [{contestId: contest}, {userId: userId}, {isOpen: true}]}, function(err, data) {
			console.log("all active positions err----", err);
			console.log("finding all active positions ------", data);
			if (data.length == 0) {
				console.log("data.length was 0")
				res.json([{
										position: [{
											name: null,
											volume: null,
											price: null,
											value: null
										}]
								}]);
			}
			else {
				res.json(data);
			}
		});
	});

	app.get('/api/getContestList', function(req, res) {
		Contest.find({ $or: [{status: 'pending_but_can_make_trades'}, {status: 'pending_but_cannot_make_trades'}]}, function(err, data) {
			res.json(data);
		});
	});


	app.get('/api/getStockInfo/:query', function(req, res) {
		let query = req.params.query;
		Company.find({ $or: [{ticker: {$regex: ".*"+query+".*", $options: "-i"}}, {name: {$regex: ".*"+query+".*", $options: "-i"}}]}, function(err, data) {
			res.json(data);
		});

	});

	app.post('/api/contestcreate', function(req, res) {
		let contestParameters = req.body;
		console.log(contestParameters);
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		console.log("user id", userId);
		let date = new Date();
		let day = date.getDay();
		let hour = date.getHours();
		let minutes = (date.getMinutes())/60;
		let hourMin = hour+minutes;
		console.log("day----", day);
		console.log("hour----", hour);
		console.log("minutes -------", minutes);
		console.log("hourMin", hourMin);
		if (day == 0 || day == 6) {
			var status = 'pending_but_can_make_trades';
		}
		else if ((day != 0 || day !=  6) && (hourMin >= 9.5 && hourMin < 16)) {
			var status = 'pending_but_cannot_make_trades';
		}
		else {
			var status = 'pending_but_can_make_trades';
		}


		Contest.create({
			title: contestParameters.contestname,
			participantCount: contestParameters.contestsize,
			buyIn: contestParameters['buy-in'],
			contestType: contestParameters.contesttype,
			prizeTotals: (contestParameters.contestsize*contestParameters['buy-in']),
			status: status,
			contestants: []
		}, function(err, data) {
			console.log(data);

		});
		res.redirect("/");
	});

	app.get('/api/addstock', function(req, res) {
		console.log("cookie", req.cookies);
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		console.log("user id", userId);
	});
	/*
		ROUTES TO MAKE:

		GET a user's stocks for a given contest
		GET a user's history for a given contest
		GET the leaderboard for a given contest
		GET all of the active contests for a given user
		GET the history of past contests for a given user
		GET all of the available contests to display on the home page
		POST a new contest
		POST a new position for a given user in a given contest
	 */



}

function updateNYSE() {

let url = "http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NYSE&render=download";
		let options = {
			directory: "./files",
			filename: "nyse.xlsx"
		}

		download(url, options, function(err) {
			if (err) throw err
		csv()
		.fromFile('./files/nyse.xlsx')
		.on('json', (jsonObj) => {
			console.log("jsonObj--------------", jsonObj);
			Company.update({ticker: jsonObj.Symbol},{
				price: jsonObj.LastSale
			}, function(err, data) {
				console.log(data);
			});
		})
		.on('done', (error) => {
			console.log("error----------------", error);
		});

		});
}

function updateNASDAQ() {

let url = "http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NASDAQ&render=download";
		let options = {
			directory: "./files",
			filename: "nasdaq.xlsx"
		}

		download(url, options, function(err) {
			if (err) throw err
		csv()
		.fromFile('./files/nasdaq.xlsx')
		.on('json', (jsonObj) => {
			console.log("jsonObj--------------", jsonObj);
			Company.update({ticker: jsonObj.Symbol},{
				price: jsonObj.LastSale
			}, function(err, data) {
				console.log(data);
			});
		})
		.on('done', (error) => {
			console.log("error----------------", error);
		});

		});
}