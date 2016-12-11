import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actioncreators';
import Main from './Main';


function mapStateToProps(state) {
	return {
		test: state.test,
		test2: state.test2
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}


const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;