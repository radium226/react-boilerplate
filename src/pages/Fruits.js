import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Progress from '../components/Progress';

class Fruits extends Component {

  static propTypes = {
    children: PropTypes.element,
  }

  static contextTypes = {
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Progress />
        <h1><FormattedMessage id="fruits.title" /></h1>
        { this.props.children }
      </div>
    );
  }

}

export default Fruits;
