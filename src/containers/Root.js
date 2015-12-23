import React, { Component, PropTypes, Children } from 'react';
import DevTools from './DevTools';

import { connect } from 'react-redux';

function mapStateToProps(state) {
  console.log(state);
  return {
    fruits: state.fruits,
  };
}

class Root extends Component {

  static propTypes = {
    children: PropTypes.element,
    fruits: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

// http://stackoverflow.com/questions/28780998/how-can-i-pass-props-context-to-dynamic-childrens-in-react?rq=1
  render() {
    const childrenWithProps = Children.map(this.props.children, (child) => { return React.cloneElement(child, { fruits: this.props.fruits, dispatch: this.props.dispatch }); });
    return (
      <div>
        { childrenWithProps }
        <DevTools />
      </div>
    );
  }

}

export default connect(mapStateToProps)(Root);
