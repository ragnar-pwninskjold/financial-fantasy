import React from 'react';


export default class SingleContestTableRow extends React.Component {
	
	handleClick(e) {
		let id = this.props.singleContestPositions[0][this.props.i]._id;
		console.log("INSIDE HANDLE CLICK, ID------", id);
		let value =  this.props.singleContestPositions[0][this.props.i].position.value;
		let contest = this.props.location.pathname.split('/')[2];

		this.props.deleteRow(id, value, contest);
	}

	render() {
		if (this.props.receivedMessage[0] == 'ENTRY_CLOSED' || this.props.receivedMessage[0] == "ACTIVE_CONTEST" ) {
			return (
					<tr className="single-contest-table-row">
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position.name}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position.volume}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position.price}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position.value}</td>
					</tr>
			)
		}
		else if (this.props.singleContestPositions[0][0].position.name == null) {
			return (
					<tr className="single-contest-table-row">
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position.name}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position.volume}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position.price}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position.value}</td>
					</tr>
			)
		}
		else {
			return (
					<tr className="single-contest-table-row">
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position.name}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position.volume}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position.price}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position.value}</td>
						<td className="rowbutton"><button className="delete-button-single-contest" onClick={this.handleClick.bind(this)}>X</button></td>
					</tr>
			)
		}
	}
}