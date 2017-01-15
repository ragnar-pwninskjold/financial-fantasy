import React from 'react';
import { browserHistory } from 'react-router';



export default class ActiveContestTableRow extends React.Component {
	
	handleClick(e) {
		let contest = this.props.activeData[0][this.props.i]._id;
		browserHistory.push('/contest/'+contest);
	}

	render() {
		console.log("this.props.activeData",this.props.activeData);
		if (this.props.activeData[0] != undefined) {
			let user = this.props.activeData[0][0].requestingUser;
			console.log("REQUESTING USER", user);
			let thisContestLeaderboard = this.props.activeData[0][this.props.i].leaderBoard;
			console.log("thisContestLeaderboard", thisContestLeaderboard);
			var positionInContest;
			for (var i = 0; i < thisContestLeaderboard.length; i++) {
				if (thisContestLeaderboard[i].user == user) {
					console.log("index of user, ", i);
					positionInContest = i;
				}
			}
		}
		return (
				<tr className="active-contest-table-row">
					<td className="rowdata active-hover" onClick={this.handleClick.bind(this)}>{this.props.activeData[0][this.props.i].title}</td>
					<td className="rowdata">{positionInContest+1}</td>
					<td className="rowdata">{this.props.activeData[0][this.props.i].buyIn}</td>
				</tr>
		)
	}
}