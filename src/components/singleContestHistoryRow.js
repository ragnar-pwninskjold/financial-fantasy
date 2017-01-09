import React from 'react';


export default class SingleContestHistoryRow extends React.Component {
	render() {
		return (
				<tr className="single-contest-table-row">
					<td className="rowdata">{this.props.historyTable[this.props.i].companyName}</td>
					<td className="rowdata">{this.props.historyTable[this.props.i].transactionType}</td>
					<td className="rowdata">{this.props.historyTable[this.props.i].transactionVolume}</td>
					<td className="rowdata">{this.props.historyTable[this.props.i].transactionPrice}</td>
					<td className="rowdata">{this.props.historyTable[this.props.i].transactionValue}</td>
				</tr>
		)
	}
}