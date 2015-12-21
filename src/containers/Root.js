import React, { Component, PropTypes, Children } from 'react';
import DevTools from './DevTools';

import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    fruits: state.fruits,
  };
}

class Root extends Component {

  static propTypes = {
    children: PropTypes.element,
    fruits: PropTypes.array,
  }

  constructor(props) {
    super(props);
  }

// http://stackoverflow.com/questions/28780998/how-can-i-pass-props-context-to-dynamic-childrens-in-react?rq=1
  render() {
    const childrenWithProps = Children.map(this.props.children, (child) => { return React.cloneElement(child, { fruits: this.props.fruits }); });
    return (
      <div>
        { childrenWithProps }
        <DevTools />
      </div>
    );
  }

}

export default connect(mapStateToProps)(Root);
