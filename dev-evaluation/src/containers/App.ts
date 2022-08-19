import { connect } from 'react-redux';
import App from '../App';
import { Store } from '../types';
import { Dispatch } from 'redux';
import * as actions from '../actions';

function mapStateToProps(state: Store) {
  return {
    profileStatus: state.login.loaders.profile,
  };
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    logout: () => dispatch(actions.logout.request())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
