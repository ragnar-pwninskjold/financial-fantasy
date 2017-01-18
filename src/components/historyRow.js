import React from 'react';


export default class HistoryRow extends React.Component {

	render() {
		if (this.props.history[0] != undefined) {
			let user = this.props.history[0][0][0].requestingUser;
			console.log("REQUESTING USER", user);
			let thisContestLeaderboard = this.props.history[0][0][this.props.i].leaderBoard;
			console.log("thisContestLeaderboard", thisContestLeaderboard);
			var positionInContest;
			var winnings;
			for (var i = 0; i < thisContestLeaderboard.length; i++) {
				if (thisContestLeaderboard[i].user == user) {
					console.log("index of user, ", i);
					positionInContest = i;
				}
			}

			let prizeTotals = this.props.history[0][0][this.props.i].prizeTotals;
			console.log("prizeTotals", prizeTotals);
			let numberParticipating = this.props.history[0][0][this.props.i].contestants.length;
			let prizeCutOff = numberParticipating*.5;

			if (prizeCutOff == 1 && positionInContest+1 == 1) {
				console.log("GOT INSIDE OF THE PROPER IF STATEMENT");
				winnings = prizeTotals;
			}
			else if (prizeCutOff == 1 && positionInContest+1 == 2) {
				console.log("GOT INSIDE OF THE PROPER IF STATEMENT");
				winnings = 0;
			}
			else if (prizeCutOff > 1 && numberParticipating <= 5) {
				if (numberParticipating == 3) {
					if (positionInContest+1 == 1) {
						winnings = prizeTotals*0.6;
					}
					else if (positionInContest+1 == 2) {
						winnings = prizeTotals*0.4;
					}
					else {
						winnings = 0;
					}
				}
				else if (numberParticipating == 4) {
					if (positionInContest+1 == 1) {
						winnings = prizeTotals*0.6;
					}
					else if (positionInContest+1 == 2) {
						winnings = prizeTotals*0.4;
					}
					else {
						winnings = 0;
					}
				}
				else {
					if (positionInContest+1 == 1) {
						winnings = prizeTotals*0.6;
					}
					else if (positionInContest+1 == 2) {
						winnings = prizeTotals*0.3;
					}
					else {
						winnings = 0;
					}
				}
			}

			else if (numberParticipating > 5 && numberParticipating <=10) {
				if (positionInContest+1 == 1) {
					winnings = prizeTotals*0.5;
				}
				else if (positionInContest+1 == 2) {
					winnings = prizeTotals*0.3;
				}
				else if (positionInContest+1 == 3) {
					winnings = prizeTotals*0.15
				}
				else if (positionInContest+1 == 4) {
					winnings = prizeTotals*.05
				}
				else {
					winnings = 0;
				}
			}
			
			
		
		}
		return (
				<tr className="history-contest-table-row">
					<td className="rowdata">{this.props.history[0][0][this.props.i].title}</td>
					<td className="rowdata">{positionInContest+1}</td>
					<td className="rowdata">$ {this.props.history[0][0][this.props.i].buyIn}</td>
					<td className="rowdata">$ {winnings}</td>
				</tr>
		)
	}
}