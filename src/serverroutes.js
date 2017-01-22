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

const unirest = require('unirest');


module.exports = function(app) {


	let date = new Date();
	let day = date.getDay();
	let hour = date.getHours();
	let minutes = (date.getMinutes())/60;
	let hourMin = minutes+hour;

	var keepServerAwake = new CronJob('*/1 * * * *', function(){
		console.log("2 minute mark");
		var req = unirest("POST", "https://calm-ridge-91733.herokuapp.com/awake");

		req.headers({
		  "postman-token": "b6543013-ab1d-0ca3-b931-c0e269ebc7f1",
		  "cache-control": "no-cache"
		});


		req.end(function (res) {
		  if (res.error) throw new Error(res.error);
		});

	}, false);

	var priceUpdate = new CronJob('*/15 * * * *', function(){
		console.log("15 minute mark");
		if ((day !== 0 || day !== 6) && (hourMin >= 9.5 && hourMin < 16)){
			console.log("updating prices");
			var req = unirest("POST", "https://calm-ridge-91733.herokuapp.com/priceUpdate");

			req.headers({
			  "postman-token": "b6543013-ab1d-0ca3-b931-c0e269ebc7f1",
			  "cache-control": "no-cache"
			});


			req.end(function (res) {
			  if (res.error) throw new Error(res.error);
			});
			
		}

	}, false);

	var makeActive = new CronJob('00 30 09 * * 1-5', function(){
		//turns on all contests to active
		console.log('cron job running at 9:30 am monday through friday to turn on contests');
		Contest.update({status: 'pending_but_can_make_trades'}, {$set: {status: 'active'}}, {multi: true},function(err, data) {
			if (err) {
				console.log("errors in turning all contests active----", err);
			}
			var req = unirest("POST", "https://calm-ridge-91733.herokuapp.com/priceUpdate");

			req.headers({
			  "postman-token": "b6543013-ab1d-0ca3-b931-c0e269ebc7f1",
			  "cache-control": "no-cache"
			});


			req.end(function (res) {
			  if (res.error) throw new Error(res.error);
			});
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
		//turns off all contests to closed
		console.log('cron job running at 4:05 monday through friday to make untradeable contests tradeable (it was opened during trading hours)');
		Contest.update({status: 'active'}, {$set: {status: 'closed'}}, {multi: true},function(err, data) {
			if (err) {
				console.log("errors in turning all active to closed----", err);
			}
		});
		Position.update({}, {isOpen: false}, function(err, data) {
			// console.log("closing all positions - - - - - - - -", data);
		});

		Contest.insertMany([
			{title: 'The NASDAQians', 
			participantCount: 10,
			buyIn: 5,
			prizeTotals: 50,
			status: 'pending_but_can_make_trades', 
			contestants: [],
			contestantsLength: 0},
			{title: 'The NYSEians', 
			participantCount: 10,
			buyIn: 10,
			prizeTotals: 100,
			status: 'pending_but_can_make_trades', 
			contestants: [],
			contestantsLength: 0},
			{title: 'The Gultch', 
			participantCount: 10,
			buyIn: 20,
			prizeTotals: 200,
			status: 'pending_but_can_make_trades', 
			contestants: [],
			contestantsLength: 0},
			{title: '2Kewl4Skewl', 
			participantCount: 2,
			buyIn: 10,
			prizeTotals: 20,
			status: 'pending_but_can_make_trades', 
			contestants: [],
			contestantsLength: 0},
			{title: 'Think; Full', 
			participantCount: 10,
			buyIn: 10,
			prizeTotals: 100,
			status: 'pending_but_can_make_trades', 
			contestants: [],
			contestantsLength: 0}
		]);

	}, false);

	//update leaderboard cron job
	//switch all positions to closed cron job
	keepServerAwake.start();
	priceUpdate.start();
	makeActive.start();
	makeTradeable.start();
	closeActive.start();
	// leaderUpdate.start();
	//updateleaderboard start();
	//close positions start();

	// app.get('/api/contests/changestatus/:id/:status', function(req, res) {
	// 	let contest = req.params.id;
	// 	let status = req.params.status;
	// 	Contest.findOneAndUpdate({_id: contest}, {status: status}, function(err, data) {
	// 		console.log("inside of the findOneAndUpdate for the special url");
	// 	});
	// });

	app.post('/awake', function (req, res) {
		console.log("pinged with awake");
		res.json("success");
	});

	app.get('/api/getinfo/:contest', function(req, res) {
		let contest = req.params.contest;

		Contest.findOne({_id: contest}, function(err, data) {
			res.json(data);
		});
	});

	app.post('/api/contests/:contestid/buy/:stock', function(req, res) {
		let contest = req.params.contestid;
		let stock = req.params.stock;
	
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;



		Entries.findOne({ $and: [{userId: userId}, {contestOpen: true}, {contestId: contest}]}, function(err, data) {
			if (data.entryStatus == 'closed') {
				res.json("ENTRY_CLOSED");
			}
			else {
			var balance = data.balance;
			if (!err) {
				Company.findOne({ticker: stock}, function(err, data) {
					let price = data.price;
				
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
									res.json("SUCCESS");
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
			}
		});

		

		
		

	});

	app.get('/api/contests/active', function(req, res) {
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		Contest.find({ $and: [{'contestants.userId': userId}, {status: 'active'}]}, function(err, data) {
			var data = data;
			
			if (data.length == 0) {
				res.json(data);
			}
			else {
			data[0].requestingUser = userId;
			res.json(data);
			}
		});
	});

	app.get('/api/getcash/:contest', function(req, res) {
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		let contest = req.params.contest;
	
		Entries.findOne({ $and: [{userId: userId}, {contestId: contest}, {contestOpen: true}]}, function(err, data) {
			if (data == null) {
				res.json(5000);
			}
			else {
				res.json(data.balance);
			}
		});
	});

	app.post('/api/entry/:contest', function(req, res) {
		let status = req.body.status;
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		let contestId = req.params.contest;
		console.log("inside of entry create----------------------------------");
		Entries.create({
			userId,
			contestId,
			contestOpen: true,
			canAddPositions: true,
			entryStatus: status
		}, function(err, data) {
			console.log("err in entry create------", err);
		});
	});

	app.post('/api/entry/close/:contest', function(req, res) {
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		let username = userInfo.username;
		let contestId = req.params.contest;
		var contestBuyIn;
		var userBalance;
		Contest.findOne({ $and: [{_id: contestId}, {'contestants.userId': userId}]}, function(err, data) {
			if (data != null) {
				res.json("ALREADY_ENTERED");
			}
			else {
				User.findOne({_id: userId}, function(err, data) {
					userBalance = data.accountBalance;

					Contest.findOne({_id: contestId}, function(err, data) {
						contestBuyIn = data.buyIn;
						if (userBalance - contestBuyIn < 0) {
							throw new Error('TEST!');
							res.json("NOT_ENOUGH_ACCOUNT_FUNDS");
							return;
						}
						else {
							var newBalance = userBalance - contestBuyIn;
							User.update({_id: userId}, {accountBalance: newBalance}, function(err, data) {
								//do nothing
							});
						}
					});
				});
				Contest.update({'_id': contestId}, {$push: {contestants: {userId, username}}}, function(err, data) {
					console.log("err in pushing user to contest----", err);
				});
				Contest.update({'_id': contestId}, {$inc: {contestantsLength: 1}}, function(err, data) {
					console.log("err in pushing user to contest----", err);
				});
				Entries.findOneAndUpdate({ $and: [{userId: userId}, {contestId: contestId}, {entryStatus: 'pending'}]}, {entryStatus: 'closed'}, function(err, data) {
					console.log("error in closing contest-------", err);
					res.json("CLOSED");
				});
			}
		});
		
	});

	app.get('/api/getMessages/:contest', function(req, res) {
		let contest = req.params.contest;
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		Contest.findOne({_id: contest}, function(err, data) {
			var status = data.status;
			Entries.findOne({ $and: [{contestId: contest}, {userId: userId}]}, function(err, data) {
				var entryStatus = data.entryStatus;
			
				if (status == 'pending_but_cannot_make_trades') {
					res.json("PENDING_NO_TRADES");
				}
				else if (status == 'active') {
					res.json("ACTIVE_CONTEST");
				}
				else if (status == 'closed') {
					res.json("CONTEST_CLOSED");
				}
				else if (entryStatus == 'closed') {
					res.json("ENTRY_CLOSED");
				}
				else if (status == 'pending_but_can_make_trades') {
					res.json("GOOD_TO_TRADE");
				}
				else {
					console.log("inside of get messages, something unforseen happened");
				}
			});
		})
	});

	app.put('/api/position/delete/:id', function(req, res) {
		let positionId = req.params.id;
		let value = req.body.value;
		
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		let contest = req.body.contest;
		Position.remove({_id: positionId}, function(err, data) {
			console.log("error in deleting position------", err);
		});
		Entries.findOneAndUpdate({ $and: [{userId: userId}, {contestId: contest}, {contestOpen: true}]}, {$inc: {balance: value}}, function(err, data) {
			console.log("err", err);
			//maybe respond that it was successfully deleted
		});

	});

	app.get('/api/gethistory', function(req, res) {
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;

		Contest.find({ $and: [{'contestants.userId': userId}, {status: 'closed'}]}, function(err, data) {
			// console.log("DATA FROM API/GETHISTORY----------", data);
			if (data.length == 0) {
				res.json(data);
			}
			else {
			data[0].requestingUser = userId;
			res.json(data);
			}
			// var data = data;
			// console.log("DATA[0] BEFORE REQUESTING THE USER", data[0]);
			// data[0].requestingUser = userId;
			// console.log("DATA[0] AFTER REQUESTING THE USER", data[0]);
			// res.json(data);
		});
	});

	app.get('/api/contests/:contest/positions', function(req, res) {
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		let contest = req.params.contest;
		Position.find({ $and: [{contestId: contest}, {userId: userId}, {isOpen: true}]}, function(err, data) {
			
			if (data.length == 0) {
				res.json([{
										position: [{
											name: null,
											volume: null,
											price: null,
											value: null,
											id: null
										}]
								}]);
			}
			else {
				res.json(data);
			}
		});
	});

	app.get('/api/getContestList', function(req, res) {
		Contest.find({$or: [{status: 'pending_but_can_make_trades'}, {status: 'pending_but_cannot_make_trades'}]}, function(err, data) {
			var newDataObj = data;
			for (var i = 0; i < data.length; i++) {
				if (newDataObj[i].contestants.length < newDataObj[i].participantCount) {
					// console.log("did nothing here", newDataObj);
				}
				else {
					if (i > -1) {
					    newDataObj.splice(i, 1);
					    // console.log("just spliced", newDataObj);
					}
				}
			}
			res.json(newDataObj);
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
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		let date = new Date();
		let day = date.getDay();
		let hour = date.getHours();
		let minutes = (date.getMinutes())/60;
		let hourMin = hour+minutes;
	
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
			participantCount: contestParameters.size,
			buyIn: contestParameters['buyin'],
			contestType: contestParameters.contesttype,
			prizeTotals: (contestParameters.size*contestParameters['buyin']),
			status: status,
			contestants: [],
			contestantsLength: 0
		}, function(err, data) {
			// console.log(data);

		});
		res.redirect("/");
	});

	app.get('/api/addstock', function(req, res) {
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
	});

	app.get('/api/accountbalance', function(req, res) {

		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		User.findOne({_id: userId}, function(err, data) {
			let accountBalance = data.accountBalance;
			res.json(accountBalance);
		});

	});
}

















