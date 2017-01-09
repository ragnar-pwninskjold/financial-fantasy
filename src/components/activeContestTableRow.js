import React from 'react';


export default class ActiveContestTableRow extends React.Component {
	render() {
		return (
				<tr className="active-contest-table-row">
					<td className="rowdata">{this.props.activeData[0][this.props.i].title}</td>
					<td className="rowdata">{/*this.props.activeData[0][this.props.i].position*/} position test</td>
					<td className="rowdata">{this.props.activeData[0][this.props.i].buyIn}</td>
				</tr>
		)
	}
}