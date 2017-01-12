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

	// updateLeaderboard();


	let date = new Date();
	let day = date.getDay();
	let hour = date.getHours();
	let minutes = (date.getMinutes())/60;
	let hourMin = minutes+hour;
	console.log("hourMin", hourMin);

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
		console.log('cron job running every 15 mins, mon-fri 9:45 - 4');
		if ((day !== 0 || day !== 6) && (hourMin >= 9.75 && hourMin < 16)){
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
		//turns off all contests to closed
		console.log('cron job running at 4:05 monday through friday to make untradeable contests tradeable (it was opened during trading hours)');
		Contest.update({status: 'active'}, {$set: {status: 'closed'}}, {multi: true},function(err, data) {
			if (err) {
				console.log("errors in turning all active to closed----", err);
			}
		});

	}, false);

	var leaderUpdate = new CronJob('*/15 * * * *', function(){
		console.log('cron job running every 15 mins to update leaderboard, mon-fri 10 - 4');
		if ((day != 0 || day !=6) && (hourMin >= 10 && hour < 16)){
			//update leaderboard
		}

	}, false);

	//update leaderboard cron job
	//switch all positions to closed cron job

	priceUpdate.start();
	makeActive.start();
	makeTradeable.start();
	closeActive.start();
	leaderUpdate.start();
	//updateleaderboard start();
	//close positions start();

	app.post('/api/contests/:contestid/buy/:stock', function(req, res) {
		let contest = req.params.contestid;
		let stock = req.params.stock;
	
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;


		Entries.findOne({ $and: [{userId: userId}, {contestOpen: true}, {contestId: contest}]}, function(err, data) {
			console.log("data from inside Entries.find", data);
			if (data.entryStatus == 'closed') {
				console.log("BECAUSE IT WAS CLOSED");
				res.json("ENTRY_CLOSED");
			}
			else {
			console.log("DATA--------------", data);
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
		console.log("user id", userId);
		Contest.find({ $and: [{'contestants': userId}, {status: 'active'}]}, function(err, data) {
			res.json(data);
		});
	});

	app.get('/api/getcash/:contest', function(req, res) {
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		let contest = req.params.contest;
	
		Entries.findOne({ $and: [{userId: userId}, {contestId: contest}, {contestOpen: true}]}, function(err, data) {
			console.log("inside of contest get cash");
			res.json(data.balance);
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
		Contest.update({'_id': contestId}, {$push: {contestants: userId}}, function(err, data) {
			console.log("err in pushing user to contest----", err);
			console.log("data from pushing to user to contest----", data);
		});
	});

	app.post('/api/entry/close/:contest', function(req, res) {
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		let contestId = req.params.contest;
		var contestBuyIn;
		var userBalance;
		User.findOne({_id: userId}, function(err, data) {
			console.log("data inside of the User.find -------------------", data)
			userBalance = data.accountBalance;
			Contest.findOne({_id: contestId}, function(err, data) {
				contestBuyIn = data.buyIn;
				console.log("data inside of contest.find----------------", data);
				if (userBalance - contestBuyIn < 0) {
					throw new Error('TEST!');
					res.json("NOT_ENOUGH_ACCOUNT_FUNDS");
					return;
				}
				else {
					console.log("inside of else statement ------------------------");
					console.log("userBalance", userBalance);
					console.log("contestBuyIn", contestBuyIn);
					var newBalance = userBalance - contestBuyIn;
					console.log("newBalance", newBalance);
					User.update({_id: userId}, {accountBalance: newBalance}, function(err, data) {
						//do nothing
					});
				}
			});
		});
		Entries.findOneAndUpdate({ $and: [{userId: userId}, {contestId: contestId}, {entryStatus: 'pending'}]}, {entryStatus: 'closed'}, function(err, data) {
			console.log("error in closing contest-------", err);
			res.json("CLOSED");
		});
	});

	app.get('/api/getMessages/:contest', function(req, res) {
		let contest = req.params.contest;
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		Contest.findOne({_id: contest}, function(err, data) {
			console.log("data in getMessage -----------------", data);
			var status = data.status;
			Entries.findOne({ $and: [{contestId: contest}, {userId: userId}]}, function(err, data) {
				var entryStatus = data.entryStatus;
				console.log("status inside of getMessages", status);
				console.log("status inside of Entries inside of get Messages", entryStatus);
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
		/*
		OPTIONS:
		1. pending_but_cannot_make_trades (market is active)
		2. ENTRY_CLOSED
		3. CONTEST_CLOSED
		4. Actiev
		*/
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
			console.log("inside of update");
			console.log("err", err);
			//maybe respond that it was successfully deleted
		});

	});

	app.get('/api/gethistory', function(req, res) {
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;

		Contest.find({ $and: [{userId: userId}, {status: 'closed'}]}, function(err, data) {
			res.json(data);
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
				console.log("POSITION.FIND DATA--------------", data);
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
			participantCount: contestParameters.contestsize,
			buyIn: contestParameters['buy-in'],
			contestType: contestParameters.contesttype,
			prizeTotals: (contestParameters.contestsize*contestParameters['buy-in']),
			status: status,
			contestants: []
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

function updateLeaderboard() {

	Contest.find({status: 'active'}, function(err, data) {
		console.log("data from inside updateLeaderboard", data);
		for (var i = 0; i < data.length; i++) {
			let contest = data[i]._id;
			Position.find({$and: [{isOpen: true}, {contestId: contest}]}, function(err, data) {
				console.log("position.find inside of updateLeaderboard", data);
				var userArray = [];
				for (var j = 0; j < data.length; j++) {
					console.log("data i inside of Position.find, inside of update leaderBoard-----------------", j);
					console.log("actual data inside of Position.find", data);
					if (userArray.contains(data[j].userId)) {
						continue;
					}
					else {
						userArray.push(data[j].userId);
					}
				}
				console.log("userArray----------------",userArray);

			});

		}
	});
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
			Company.update({ticker: jsonObj.Symbol},{
				price: jsonObj.LastSale
			}, function(err, data) {
				//nothing
				//need to update positions for value with new price
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
			//nothing
			Company.update({ticker: jsonObj.Symbol},{
				price: jsonObj.LastSale
			}, function(err, data) {
				//nothing
			});
		})
		.on('done', (error) => {
			console.log("error----------------", error);
		});

		});
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}