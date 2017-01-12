import React from 'react';


export default class SingleContestTableRow extends React.Component {
	
	handleClick(e) {
		console.log("INSIDE HANDLE CLICK, THIS.PROPS", this.props);
		console.log("INSIDE HANDLE CLICK, TO THE POSITION", this.props.singleContestPositions[0][this.props.i].position[0]);
		let id = this.props.singleContestPositions[0][this.props.i]._id;
		console.log("INSIDE HANDLE CLICK, ID------", id);
		let value =  this.props.singleContestPositions[0][this.props.i].position[0].value;
		let contest = this.props.location.pathname.split('/')[2];

		this.props.deleteRow(id, value, contest);
	}

	render() {
		if (this.props.receivedMessage[0] == 'ENTRY_CLOSED') {
			return (
					<tr className="single-contest-table-row">
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position[0].name}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position[0].volume}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position[0].price}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position[0].value}</td>
					</tr>
			)
		}
		else {
			return (
					<tr className="single-contest-table-row">
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position[0].name}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position[0].volume}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position[0].price}</td>
						<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position[0].value}</td>
						<td className="rowbutton"><button className="delete-button-single-contest" onClick={this.handleClick.bind(this)}>X</button></td>
					</tr>
			)
		}
	}
}