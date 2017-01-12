import React from 'react';
import { browserHistory } from 'react-router';


export default class TableRow extends React.Component {


	handleClick(e) {
		let location = this.props.contestTableTest[0][this.props.i]['_id'];
		this.props.enterContest(location, "pending");
		browserHistory.push('/contest/'+location);
		
	}

	alertMessage(message) {
		
		console.log(message);
		
	}

	render() {
		return (
			<tr>
				<td className="contest-name-hover">{this.props.contestTableTest[0][this.props.i].title}</td>
				<td>{this.props.contestTableTest[0][this.props.i].contestants.length}/ {this.props.contestTableTest[0][this.props.i].participantCount}</td>
				<td>${this.props.contestTableTest[0][this.props.i].buyIn}</td>
				<td>${this.props.contestTableTest[0][this.props.i].prizeTotals}</td>
				<td><button onClick={this.handleClick.bind(this, "4")}>Enter Contest</button></td>
			</tr>
		)
	}
}