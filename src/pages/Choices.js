import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class Choices extends Component {

  static propTypes = {
    children: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul>
        <li>
          <Link to="/fruits">Fruits</Link>
        </li>
        <li>
          <Link to="/vegetables">Vegetables</Link>
        </li>
      </ul>
    );
  }

}

export default Choices;
