import React from 'react';
import ContestTable from './contestTable';
import ContestTableTitle from './contestTableTitle';




export default class ContestContainer extends React.Component {
	render() {
		return (
			<div className="contest-container">
				<ContestTableTitle />
				
				<ContestTable {...this.props}/>
			</div>
		)
	}
}