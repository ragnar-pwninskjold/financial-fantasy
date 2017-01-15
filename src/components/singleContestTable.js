import React from 'react';
import SingleContestTableRow from './singleContestTableRow';


export default class SingleContestTable extends React.Component {

	componentWillMount() {
		let contest = this.props.location.pathname.split('/')[2];

		this.props.retrieveSingleContestPositions(contest);
	}

	render() {
		if (this.props.receivedMessage[0] == 'ENTRY_CLOSED') {
			return (
				<div>
					<table className="single-contest-table">
						<tr>
							<th className="company-name">Company Name</th>
							<th className="share-number"># of shares</th>
							<th className="price">Price</th>
							<th className="current-value">Value</th>
						</tr>
						{Object.keys(this.props.singleContestPositions[0]).map((i) => <SingleContestTableRow {...this.props} key={i} i={i} />)}

					</table>
				</div>
			)
		}
		else {
			return (
				<div>
					<table className="single-contest-table">
						<tr>
							<th className="company-name">Company Name</th>
							<th className="share-number"># of shares</th>
							<th className="price">Price</th>
							<th className="current-value">Value</th>
							<th className="delete-button-single-contest-header"></th>
						</tr>
						{Object.keys(this.props.singleContestPositions[0]).map((i) => <SingleContestTableRow {...this.props} key={i} i={i} />)}

					</table>
				</div>
			)
		}
	}
}