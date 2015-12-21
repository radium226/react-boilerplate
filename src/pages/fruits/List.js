import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';

class List extends Component {

  static propTypes = {
    fruits: PropTypes.array,
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul>
          { _.map(this.props.fruits, (fruit, index) => { return (<li key={ index }>{ fruit }</li>); }) }
        </ul>
        <p><Link to="/fruits/add">Ajouter</Link></p>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return { fruits: state.fruits };
}

export default connect(mapStateToProps)(List);
