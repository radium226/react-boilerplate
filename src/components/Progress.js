import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import NProgress from 'nprogress';

class Progress extends Component {

  static propTypes = {
    progressing: PropTypes.number,
  };

  render() {
    if (this.props.progressing > 0) {
      NProgress.start();
    } else {
      NProgress.done();
    }
    return false;
  }

}

export default connect(state => ({
  progressing: state.progress.progressing
}))(Progress);
