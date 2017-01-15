import React from 'react';
import TableRow from './tableRow';
import {modal} from 'react-redux-modal';




export default class ContestTable extends React.Component {

	componentWillMount() {
		this.props.getContests();
	}

	render() {
		return (
			<div className="contest-table-container">
				<table className="contest-table">
					<tr>
						<th>Contest Name</th>
						<th>Participants</th>
						<th>Entry Fee</th>
						<th>Prizes</th>
						<th className="button-space"> </th>
					</tr>
					{Object.keys(this.props.contestTableTest[0]).map((key) => <TableRow {...this.props} key={key} i={key} />)}
				</table>
			</div>
		)
	}
}