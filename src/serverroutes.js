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

	// updateLeaderboard()
	// updateNASDAQ();


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
		console.log("15 minute mark");
		if ((day !== 0 || day !== 6) && (hourMin >= 9.5 && hourMin < 16)){
			console.log("updating prices");
			updateNYSE(function() {
				updateNASDAQ(function() {
					updateLeaderboard2();
				});
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
			console.log("closing all positions - - - - - - - -", data);
		});

	}, false);

	//update leaderboard cron job
	//switch all positions to closed cron job

	priceUpdate.start();
	makeActive.start();
	makeTradeable.start();
	closeActive.start();
	// leaderUpdate.start();
	//updateleaderboard start();
	//close positions start();

	app.get('/api/contests/changestatus/:id/:status', function(req, res) {
		let contest = req.params.id;
		let status = req.params.status;
		Contest.findOneAndUpdate({_id: contest}, {status: status}, function(err, data) {
			console.log("inside of the findOneAndUpdate for the special url");
		});
	});

	app.get('/api/getinfo/:contest', function(req, res) {
		let contest = req.params.contest;

		Contest.findOne({_id: contest}, function(err, data) {
			console.log("DATA FROM INSIDE OF GETINFO CONTEST", data);
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
				console.log("BECAUSE IT WAS CLOSED");
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
							console.log("WASNT ENOUGH FUNDS");
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
		console.log("USER INFO", userInfo);
		let userId = userInfo._id;
		Contest.find({ $and: [{'contestants.userId': userId}, {status: 'active'}]}, function(err, data) {
			var data = data;
			console.log("DATA BEFORE REQUESTING THE USER", data);
			console.log("DATA[0] BEFORE REQUESTING THE USER", data[0]);
			if (data.length == 0) {
				res.json(data);
			}
			else {
			data[0].requestingUser = userId;
			console.log("DATA[0] AFTER REQUESTING THE USER", data[0]);
			res.json(data);
			}
		});
	});

	app.get('/api/getcash/:contest', function(req, res) {
		let userInfo = jwtDecode(req.cookies.token);
		let userId = userInfo._id;
		let contest = req.params.contest;
	
		Entries.findOne({ $and: [{userId: userId}, {contestId: contest}, {contestOpen: true}]}, function(err, data) {
			console.log("inside of contest get cash");
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
				console.log("right inside of the first if --- - - - - - - - --- ");
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
			console.log("inside of update");
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
			console.log("DATA[0] AFTER REQUESTING THE USER", data[0]);
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
			participantCount: contestParameters.size,
			buyIn: contestParameters['buyin'],
			contestType: contestParameters.contesttype,
			prizeTotals: (contestParameters.size*contestParameters['buyin']),
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

// function updateLeaderboard() {

// 	Contest.find({status: 'active'}, function(err, data) {
// 		var contestArray = [];
// 		for (var j = 0; j < data.length; j++) {
			
// 			if (contestArray.contains(data[j]._id)) {
// 				continue;
// 			}
// 			else {
// 				contestArray.push(data[j]._id);
// 			}
// 		}

// 		console.log("contestArray", contestArray);

// 		for (var i = 0; i < contestArray.length; i++) {
// 			console.log("contestArray[i]",contestArray[i]);

// 			Position.aggregate({ $match: 
// 				{$and: [
// 					{contestId: contestArray[i]}, {isOpen: true}
// 				]
// 				}
// 				},
// 				{$group: {
// 					_id: "$userId",
// 					totalValue: {$sum: "$position.value"}
// 				}}, function(err, data) {
// 					console.log("error inside of updating leaderboard", err);
// 					console.log("data inside of updating leaderboard", data);
// 				}	
// 				);
// 		}
// 	});
// }

function updateLeaderboard2() {

	Position.find({isOpen: true}, function(err, data) {
		var userArray = [];
		for (var j = 0; j < data.length; j++) {
			if (userArray.contains(data[j].userId)) {
				continue;
			}
			else {
				userArray.push(data[j].userId);
			}
		}
		for (var i = 0; i < userArray.length; i++) {
			handleAggregate(i, userArray);

		}
	});

	

	// Contest.find({status: 'active'}, function(err, data) {
	// 	console.log("data from inside updateLeaderboard", data);
	// 	for (var i = 0; i < data.length; i++) {
	// 		let contest = data[i]._id;
	// 		Position.find({$and: [{isOpen: true}, {contestId: contest}]}, function(err, data) {
	// 			console.log("position.find inside of updateLeaderboard", data);
	// 			var userArray = [];
	// 			for (var j = 0; j < data.length; j++) {
	// 				console.log("data i inside of Position.find, inside of update leaderBoard-----------------", j);
	// 				console.log("actual data inside of Position.find", data);
	// 				if (userArray.contains(data[j].userId)) {
	// 					continue;
	// 				}
	// 				else {
	// 					userArray.push(data[j].userId);
	// 				}
	// 			}
	// 			for (var k = 0; k < userArray.length; k++){

	// 				Position.find({$and: [{isOpen: true}, {contestId: contest}, {userId: userArray[k]}]})
	// 			}


	// 			console.log("userArray----------------",userArray);

	// 		});

	// 	}
	// });
}

function updateNYSE(cb) {

var price;

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
			price = jsonObj.LastSale;
				Company.update({ticker: jsonObj.Symbol}, {price: jsonObj.LastSale}, function(err, data) {
					// console.log("updated");
				});	
				Position.find({ $and: [{isOpen: true}, {'position.name':jsonObj.Symbol}]}, function(err, data) {
					// console.log("position found-----");
					// console.log("found positions", data);
					// console.log("price", price);
					// console.log("jsonObj.LastSale", jsonObj.LastSale);
					// console.log("ticker", jsonObj.Symbol);
					if (data == null || undefined) {
						//do nothing
					}
					else {
						// console.log("PRICE RIGHT BEFORE I SEND IT-----------", price);
						// console.log("JSONOBJ>LASTSALE RIGHT BEFORE I SEND IT-----------", jsonObj.LastSale);
						handlePositionUpdate(jsonObj.LastSale, data);
					}
				});		
			})
			.on('done', (error) => {
				cb();
				console.log("error----------------", error);

			});

			});
		

}

function updateNASDAQ(cb) {

let url = "http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NASDAQ&render=download";
		let options = {
			directory: "./files",
			filename: "nasdaq.xlsx"
		}
		var price;

		download(url, options, function(err) {
			if (err) throw err
		csv()
		.fromFile('./files/nasdaq.xlsx')
		.on('json', (jsonObj) => {
			//nothing
			price = jsonObj.LastSale;
			Company.update({ticker: jsonObj.Symbol}, {price: jsonObj.LastSale}, function(err, data) {
				// console.log("updated");
			});	
			Position.find({ $and: [{isOpen: true}, {'position.name':jsonObj.Symbol}]}, function(err, data) {
				// console.log("position found-----");
				// console.log("found positions", data);
				// console.log("price", price);
				// console.log("jsonObj.LastSale", jsonObj.LastSale);
				// console.log("ticker", jsonObj.Symbol);
				if (data == null || undefined) {
					//do nothing
				}
				else {
					// console.log("PRICE RIGHT BEFORE I SEND IT-----------", price);
					// console.log("JSONOBJ>LASTSALE RIGHT BEFORE I SEND IT-----------", jsonObj.LastSale);
					handlePositionUpdate(jsonObj.LastSale, data);
				}
			});		
		})
		.on('done', (error) => {
			cb();
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

function handleLeader(user, sums) {
	// console.log("user id, inside handleLeader", user);
	// console.log("sum by contest inside handleLeader", sums);
	for (var i = 0; i < sums.length; i++) {
		addUserToLeaderboard(user, sums[i]._id, sums[i].totalValue);
	}
	


}

function handlePositionUpdate(price, positions) {
	for (i = 0; i < positions.length; i++) {
		console.log('positions['+i+']',positions[i]);
			Position.update({_id: positions[i]._id}, {'position.price': price, 'position.value': price*positions[i].position.volume}, function(err, data) {
				if (err) {
					console.log(err);
				}
			});
		
	}
}

function handleAggregate(i, userArray) {



	Position.aggregate({ $match: 
		{$and: [
			{userId: userArray[i]}, {isOpen: true}
		]
		}
		},
		{$group: {
			_id: "$contestId",
			totalValue: {$sum: "$position.value"}
		}}, function(err, data) {
			// console.log("error inside of updating leaderboard", err);		
			handleLeader(userArray[i], data); //doesn't work properly / doesn't pass in correct user
		}	
		);


}

function addUserToLeaderboard (user, contest, value) {
	console.log("USER INSIDE OF ADD USER TO LEADERBOARD-------------------", user);
	console.log("CONTEST INSIDE OF ADD USER TO LEADERBOARD-------------------", contest);
	console.log("VALUE INSIDE OF ADD USER TO LEADERBOARD-------------------", value);

	Contest.findOne({$and: [{_id: contest}, {'leaderBoard.user': user}, {status: 'active'}]}, function(err, data) {
		if (data == null) {
			console.log("inside of data null", data);
			Contest.update({$and: [{_id: contest}, {status: 'active'}]}, {$push: {
				leaderBoard: {
					user, 
					totalValue: value
				}
			}}, function(err, data) {
				console.log("data", data);
			});

			Contest.update({$and: [{_id: contest}, {status: 'active'}]}, {$push: {
				leaderBoard: {
					"$each": [],
					"$sort": {'totalValue': -1}
				}
			}}, function(err, data) {
				console.log("data", data);
			});
		}
		else {
			Contest.update({$and: [{_id: contest}, {'leaderBoard.user': user}, {status: 'active'}]}, {
				$set: {
					"leaderBoard.$.totalValue": value
				}
			}, function(err, data) {
				console.log("data after the update in the else - - - - - - - - ", data);

			});
			Contest.update({$and: [{_id: contest}, {status: 'active'}]}, {$push: {
				leaderBoard: {
					"$each": [],
					"$sort": {'totalValue': -1}
				}
			}}, function(err, data) {
				console.log("data", data);
			});
		}
	});

	// Contest.update({$and: [{_id: contest}, {'leaderBoard.user': user}, {status: 'active'}]}, {},
	//  function(err, data) {
	// 	console.log("data from adding user to leaderboard", data);
	// });
}

// function calculateWinners() {
// 	Contest.update({status: 'closed'}, {$push: {
// 		$each: [],
// 		$sort: 
// 	}}, function(err, data) {

// 	});
// }








