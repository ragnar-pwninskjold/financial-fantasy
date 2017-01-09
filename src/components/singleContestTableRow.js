import React from 'react';


export default class SingleContestTableRow extends React.Component {
	render() {
		let test = this.props.singleContestPositions[0][this.props.i].position;
		console.log("this.props.singleContestPositions[0][this.props.i].position", test);
		let test2 = this.props.singleContestPositions[0][this.props.i];
		console.log("this.props.singleContestPositions[0][this.props.i]", test2);
		let test3 = this;
		console.log("this", this);
		return (
				<tr className="single-contest-table-row">
					<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position[0].name}</td>
					<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position[0].volume}</td>
					<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position[0].price}</td>
					<td className="rowdata">{this.props.singleContestPositions[0][this.props.i].position[0].value}</td>
				</tr>
		)
	}
}