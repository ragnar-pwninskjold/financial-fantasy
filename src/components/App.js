import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actioncreators';
import Main from './Main';



//put all of the test data files in here
function mapStateToProps(state) {
	return {
		test1: state.test1,
		contestTableTest: state.contestTableTest,
		activeData: state.activeData,
		historyData: state.historyData,
		historyTable: state.historyTable,
		leaderboard: state.leaderboard,
		searchYield: state.searchYield,
		singleContestPositions: state.singleContestPositions
		}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}


const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;