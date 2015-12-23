import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect, bindActionCreators } from 'react-redux';
import _ from 'lodash';
import { fetchFruits } from '../../actions/fruits';

import { fetchVegetables } from '../../actions/vegetables';
import { beginProgress, endProgress } from '../../actions/progress';

class List extends Component {

  static propTypes = {
    fruits: PropTypes.shape({
      fruits: PropTypes.array,
      isFetching: PropTypes.boolean,
    }),
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchFruits());
    dispatch(fetchVegetables());
  }

  handleClick(event) {
    const { dispatch } = this.props
    dispatch(fetchFruits());
  }

  doBeginProgress() {
    const { dispatch } = this.props
    dispatch(beginProgress());
  }

  doEndProgress() {
    const { dispatch } = this.props
    dispatch(endProgress());
  }

  render() {
    return (
      <div>
        <button onClick={ this.handleClick.bind(this) }>Fetch</button>
        <button onClick={ this.doBeginProgress.bind(this) }>Begin Progress</button>
        <button onClick={ this.doEndProgress.bind(this) }>End Progress</button>
        <ul>
          { _.map(this.props.fruits.fruits, (fruit, index) => { return (<li key={ index }>{ fruit }</li>); }) }
        </ul>
        <hr />
        <ul>
          { _.map(this.props.vegetables.vegetables, (vegetable, index) => { return (<li key={ index }>{ vegetable }</li>); }) }
        </ul>
        <p><Link to="/fruits/add">Ajouter</Link></p>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    fruits: state.fruits,
    vegetables: state.vegetables,
  };
}

export default connect(mapStateToProps)(List);
