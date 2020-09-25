import React from 'react'
import Hand from '../Hand/Hand'
import styles from './Scene.module.css'
import * as actionCreators from '../../store/actions'
import { connect } from 'react-redux'
import Board from '../Board/Board'
import Card from '../Card/Card'
import cumulativeRafSchd from '../../lib/cumulativeRafSchd'
import { debounce } from '../../lib/util'

class Scene extends React.Component {
  mouseMove = evt => {
    if (this.props.pickedCard) {
      evt.persist()
      this.props.moveCard(evt.pageX, evt.pageY)
      this.props.resetRotation()
    }
  }

  mouseUp = () => {
    if (this.props.pickedCard) {
      this.props.unpickCard()
    }
  }

  capturePointer = evt => null // (evt.buttons === 1) ?? evt.target.setPointerCapture(evt.pointerId)
  releasePointer = evt => null // evt.target.releasePointerCapture(evt.pointerId)

  render () {
    return (
      <>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div /* onPointerDown={this.capturePointer} onPointerUp={this.releasePointer} */
          onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} className={styles.Scene} >
          <div>
            <button onClick={this.props.drawCard}>Draw Card</button>
          </div>
          <Board/>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minWidth: '100%' }}>
            <Hand/>
          </div>

          {this.props.pickedCard &&
          <div style={{
            position: 'fixed',
            left: this.props.pickedCardPosition.x,
            top: this.props.pickedCardPosition.y,
            border: 'none',
            perspective: '500px',
            pointerEvents: 'none',
            width: this.props.pickedCardWidth,
            height: this.props.pickedCardHeight
          }}>
            <Card info={this.props.pickedCard} style={{
              width: this.props.pickedCardWidth,
              height: this.props.pickedCardHeight,
              transform: this.props.pickedCardRotation,
              transition: 'transform 0.05s ease'
            }}/>
          </div>
          }
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({
  pickedCard: state.cards.pickedCard,
  pickedCardWidth: state.cards.pickedCardWidth,
  pickedCardHeight: state.cards.pickedCardWidth * state.cards.cardRatio,
  pickedCardPosition: state.cards.pickedCardPosition,
  pickedCardRotation: `rotateX(${state.cards.pickedCardRotation.x}deg) rotateY(${state.cards.pickedCardRotation.y}deg)`
})

const mapDispatchToProps = dispatch => ({
  drawCard: () => dispatch(actionCreators.drawCard()),
  unpickCard: () => dispatch(actionCreators.unpickCard()),
  moveCard: cumulativeRafSchd((x, y) => dispatch(actionCreators.moveCard(x, y))),
  resetRotation: debounce(() => { dispatch(actionCreators.resetRotation()) }, 120)
})

export default connect(mapStateToProps, mapDispatchToProps)(Scene)
