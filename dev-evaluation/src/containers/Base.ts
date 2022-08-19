import { connect } from 'react-redux';
import Base from '../components/Base';
import { Store } from '../types';

function mapStateToProps(state: Store) {
  return {
    isAuthenticated: state.login.loaders.login,
    profile: state.login.loaders.profile,
  };
}

export default connect(mapStateToProps, {})(Base);
