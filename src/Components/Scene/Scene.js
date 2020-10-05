import React from 'react'
import styles from './Scene.module.css'
import { actionCreators } from '../../store/actions'
import { connect } from 'react-redux'
import Board from '../Board/Board'
import Card from '../Card/Card'
import cumulativeRafSchd from '../../lib/cumulativeRafSchd'
import { debounce } from '../../lib/util'
import BottomPane from '../BottomPane/BottomPane'
import Arrow from '../Arrow/Arrow'

class Scene extends React.Component {
  state = {
    from: null,
    to: { x: 100, y: 30 }
  }

  mouseMove = evt => {
    this.setState({ to: { x: evt.pageX, y: evt.pageY } })
    if (this.props.pickedCard) {
      evt.persist()
      this.props.moveCard(evt.pageX, evt.pageY)
      this.props.resetRotation()
    }
  }

  mouseUp = () => {
    if (this.props.pickedCard) this.props.unpickCard()
    else if (this.props.pickedPawn) this.props.unpickPawn()
  }

  componentDidMount () {
    if (this.props.turn) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          this.props.drawCard()
        }, 500 * (i + 1))
      }
    }
  }

  render () {
    return (
      <>
        <Arrow from={{ x: 500, y: 200 }} to={this.state.to} />
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} className={styles.Scene} >
          <div>
            <button onClick={this.props.endTurn}>{this.props.turn ? 'End Turn' : 'Not Your Turn'}</button>
          </div>
          <Board/>
          <BottomPane/>
        </div>

        {this.props.pickedCard &&
            <Card info={this.props.pickedCard} containerStyle={{
              fontSize: this.props.pickedSize,
              position: 'fixed',
              left: this.props.pickedCardPosition.x,
              top: this.props.pickedCardPosition.y,
              pointerEvents: 'none',
              zIndex: 10,
              perspective: '500px'
            }}
            style={{
              transform: this.props.pickedCardRotation
            }}/>
        }
      </>
    )
  }
}

const mapStateToProps = state => ({
  pickedCard: state.cards.pickedCard,
  pickedCardWidth: state.cards.pickedCardWidth,
  pickedCardHeight: state.cards.pickedCardWidth * state.cards.cardRatio,
  pickedCardPosition: state.cards.pickedCardPosition,
  pickedCardRotation: `rotateX(${state.cards.pickedCardRotation.x}deg) rotateY(${state.cards.pickedCardRotation.y}deg)`,
  pickedSize: state.cards.pickSize,
  pickedPawn: state.cards.pickedPawn,
  turn: state.cards.turn
})

const mapDispatchToProps = dispatch => ({
  endTurn: () => dispatch(actionCreators.endTurn()),
  drawCard: () => dispatch(actionCreators.drawCard()),
  unpickCard: () => dispatch(actionCreators.unpickCard()),
  moveCard: cumulativeRafSchd((x, y) => dispatch(actionCreators.moveCard(x, y))),
  resetRotation: debounce(() => { dispatch(actionCreators.resetRotation()) }, 120),
  unpickPawn: () => dispatch(actionCreators.pickPawn(null))
})

export default connect(mapStateToProps, mapDispatchToProps)(Scene)
