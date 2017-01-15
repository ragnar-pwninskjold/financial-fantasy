import React from 'react';


export default class LeaderBoardRow extends React.Component {


	

	render() {

		let contestInfoContestantArray = this.props.contestInfo[0].contestants;
		let leaderBoardArray = this.props.contestInfo[0].leaderBoard;

		for (var i = 0; i < leaderBoardArray.length; i++) {
			for (var j = 0; j <leaderBoardArray.length; j++){
				if (contestInfoContestantArray[i].userId == leaderBoardArray[j].user) {
					leaderBoardArray[j].username = contestInfoContestantArray[i].username;
				}
			}
		}


		return (
				<tr className="transaction-contest-table-row">
					<td className="rowdata">{leaderBoardArray[this.props.i].username}</td>
					<td className="rowdata">{this.props.contestInfo[0].leaderBoard[this.props.i].totalValue}</td>
					<td className="rowdata">{this.props.i+1}</td>
				</tr>
		)
	}
}