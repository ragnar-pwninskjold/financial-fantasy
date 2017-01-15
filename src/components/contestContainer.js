import React from 'react';
import ContestTable from './contestTable';
import ContestTableTitle from './contestTableTitle';
import CreateContestModal from './testModal';



export default class ContestContainer extends React.Component {
	render() {
		return (
			<div className="contest-container">
				<ContestTableTitle />
				<CreateContestModal />
				<ContestTable {...this.props}/>
			</div>
		)
	}
}