import React from 'react';


export default class HistoryRow extends React.Component {
	render() {
		return (
				<tr className="history-contest-table-row">
					<td className="rowdata">{this.props.historyData[this.props.i].contestName}</td>
					<td className="rowdata">{this.props.historyData[this.props.i].position}</td>
					<td className="rowdata">{this.props.historyData[this.props.i]['buy-in']}</td>
					<td className="rowdata">{this.props.historyData[this.props.i].winnings}</td>
				</tr>
		)
	}
}