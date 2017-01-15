import React from 'react';
import Navbar from './navBar';
import ActiveContestTableRow from './activeContestTableRow';


export default class ActiveContests extends React.Component {

	componentWillMount() {
		this.props.getActiveContests();
	}

	render() {
		if (this.props.activeData[0] != undefined) {
			return (
				<div>
				<Navbar />
				<h1 className="active-contest-intro">Your Active Contests</h1>
				<div className="active-contest-table-container">
					
					<table className="active-contest-table">
						<tr>
							<th className="active-contest-name">Contest name</th>
							<th className="position">Your position</th>
							<th className="active-contest-buy-in">Buy in</th>
						</tr>
						{this.props.activeData[0].map((data, i) => <ActiveContestTableRow {...this.props} key={i} i={i} />)}

					</table>
				</div>
				</div>
			)
		}
		else {
			return (
			<div>
			<Navbar />
			<h1 className="active-contest-intro">Your Active Contests</h1>
			<div className="active-contest-table-container">
				
				<table className="active-contest-table">
					<tr>
						<th className="active-contest-name">Contest name</th>
						<th className="position">Your position</th>
						<th className="active-contest-buy-in">Buy in</th>
					</tr>

				</table>
			</div>
			</div>
		)
		}
	}
}