import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../../store/actions'
import Card from '../Card/Card'
import styles from './Board.module.css'

class Board extends React.Component {
  mouseUp = evt => {
    evt.stopPropagation()
    if (this.props.pickedCard) {
      this.props.putCard()
    }
  }

  render () {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div onMouseUp={this.mouseUp} className={styles.Board}>
        {this.props.board.map(card => (<Card key={card.key} info={card} style={{
          width: 120 + 'px',
          height: 1.5 * 120 + 'px'
        }}/>))}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  board: state.cards.board,
  pickedCard: state.cards.pickedCard
})

const mapDispatchToProps = dispatch => ({
  putCard: () => dispatch(actionCreators.putCard())
})

export default connect(mapStateToProps, mapDispatchToProps)(Board)
