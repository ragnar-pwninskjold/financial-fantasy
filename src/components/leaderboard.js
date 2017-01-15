import React from 'react';
import LeaderBoardRow from './leaderBoardRow';



export default class Leaderboard extends React.Component {

	componentWillMount() {
		console.log("this", this);
		this.props.getContestInfo(this.props.location.pathname.split('/')[2]);

	}


	render() {
		console.log("THIS.PROPS.CONTESTINFO", this.props.contestInfo);
		if (this.props.contestInfo[0] != undefined) {
			return (
				<div>
					<table className="leaderboard-table">
						<tr>
							<th className="user-header">User</th>
							<th className="value-header">Value</th>
							<th className="position-header">Position</th>
						</tr>
						<tr>
							{this.props.contestInfo[0].leaderBoard.map((user, i) => <LeaderBoardRow {...this.props} key={i} i={i}/>)}
						</tr>

					</table>
				</div>
			)
		}
		else {
			return (
				<div>
					<table className="leaderboard-table">
						<tr>
							<th className="user-header">User</th>
							<th className="value-header">Value</th>
							<th className="position-header">Position</th>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
						</tr>

					</table>
				</div>
			)
		}
		
	}
}