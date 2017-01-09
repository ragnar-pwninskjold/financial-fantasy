import React from 'react';
import Navbar from './navBar';
import ActiveContestTableRow from './activeContestTableRow';


export default class ActiveContests extends React.Component {

	componentWillMount() {
		this.props.getActiveContests();
	}

	render() {
		return (
			<div className="active-contest-table-container">
				<Navbar />
				<table className="active-contest-table">
					<tr>
						<th className="active-contest-name">Contest name</th>
						<th className="position">Your position</th>
						<th className="active-contest-buy-in">Buy in</th>
					</tr>
					{Object.keys(this.props.activeData[0]).map((i) => <ActiveContestTableRow {...this.props} key={i} i={i} />)}

				</table>
			</div>
		)
	}
}