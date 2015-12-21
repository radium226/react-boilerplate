import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addFruit } from '../../actions/fruits.js';

class Add extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
  }

  handleClick() {
    this.props.dispatch(addFruit('Kiwi'));
  }

  render() {
    return (
      <div>
        <h2>Ajouter</h2>
        <button onClick={ this.handleClick.bind(this) }>Ajouter</button>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return { fruits: state.fruits };
}

export default connect(mapStateToProps)(Add);
