import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect, bindActionCreators } from 'react-redux';
import _ from 'lodash';
import { fetchFruits } from '../../actions/fruits';

import { fetchVegetables } from '../../actions/vegetables';
import { beginProgress, endProgress } from '../../actions/progress';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

class List extends Component {

  static propTypes = {
    fruits: PropTypes.shape({
      fruits: PropTypes.array,
      isFetching: PropTypes.boolean,
    }),
  }

  constructor(props) {
    super(props);

    this.state = { dialogOpen: !!!props.vegetables.error };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchFruits());
    dispatch(fetchVegetables());
  }

  handleClick(event) {
    const { dispatch } = this.props;
    dispatch(fetchFruits());
  }

  doBeginProgress() {
    const { dispatch } = this.props;
    dispatch(beginProgress());
  }

  doEndProgress() {
    const { dispatch } = this.props;
    dispatch(endProgress());
  }

  doCloseDialog(event) {
    console.log('WHATCHAAAAAAAAA');
    this.setState({ dialogOpen: false });
  }

  render() {
    const { vegetables } = this.props;
    return (
      <div>
        <button onClick={ this.handleClick.bind(this) }>Fetch</button>
        <button onClick={ this.doBeginProgress.bind(this) }>Begin Progress</button>
        <button onClick={ this.doEndProgress.bind(this) }>End Progress</button>
        <ul>
          { _.map(this.props.fruits.fruits, (fruit, index) => { return (<li key={ index }>{ fruit }</li>); }) }
        </ul>
        <hr />
        {(() => {
          console.log(vegetables);
          if (!!vegetables.error) {
            const dialogActions = [
              <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onClick={ event => { this.doCloseDialog(event); } } />
            ];
            return (
              <Dialog
                title="Dialog With Standard Actions"
                actions={dialogActions}
                open={ this.state.dialogOpen }>
                There was an error, dude. Do you wanna retry?
              </Dialog>
            );
          } else {
            return (<ul>
              { _.map(this.props.vegetables.vegetables, (vegetable, index) => { return (<li key={ index }>{ vegetable }</li>); }) }
            </ul>);
          }
        })()}
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
