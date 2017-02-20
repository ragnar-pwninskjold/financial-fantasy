import React from 'react';
import CreateContestModal from './testModal';
import HomeInstructionsModal from './homePageInstructions';


export default class ContestTableTitle extends React.Component {
	render() {
		return (
			<div className="contest-table-intro">
				<CreateContestModal />
				<h1 className="contest-table-title">Available Contests</h1>
				<HomeInstructionsModal />
			</div>
		)
	}
}