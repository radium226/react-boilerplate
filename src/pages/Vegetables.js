import React, { Component, PropTypes } from 'react';

class Vegetables extends Component {

  static propTypes = {
    children: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Vegetables</h1>
        { this.props.children }
      </div>
    );
  }

}

export default Vegetables;
