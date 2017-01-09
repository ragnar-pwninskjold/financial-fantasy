import React from 'react';
import store from '../store';


export default class ShowHide extends React.Component {

	
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.props.toggleDiv();
		console.log(store.getState());
	}

	render(currentClass) {
		return (
			<div className={store.getState().toggleReducer[0].hidden ? "toggle-div-hidden" : "toggle-div-shown"} onClick={() => this.toggle()}>
				<h1>foo</h1>
			</div>
		)
	}
}
