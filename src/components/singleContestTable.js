import React from 'react';
import SingleContestTableRow from './singleContestTableRow';


export default class SingleContestTable extends React.Component {

	componentWillMount() {
		let contest = this.props.location.pathname.split('/')[2];

		this.props.retrieveSingleContestPositions(contest);
	}

	render() {
		return (
			<div>
				<table className="single-contest-table">
					<tr>
						<th className="company-name">Company Name</th>
						<th className="share-number"># of shares</th>
						<th className="price">Price</th>
						<th className="current-value">Current Value</th>
					</tr>
					{Object.keys(this.props.singleContestPositions[0]).map((i) => <SingleContestTableRow {...this.props} key={i} i={i} />)}

				</table>
			</div>
		)
	}
}