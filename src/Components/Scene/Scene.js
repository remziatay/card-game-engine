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

  render () {
    return (
      <>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} className={styles.Scene} style={{
          perspectiveOrigin: this.props.perspectiveOrigin
        }}>
          <div>
            <button onClick={this.props.drawCard}>Draw Card</button>
          </div>
          <Board/>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minWidth: '100%' }}>
            <Hand/>
          </div>

          {this.props.pickedCard &&
        <Card info={this.props.pickedCard} style={{
          position: 'fixed',
          width: this.props.pickedCardWidth,
          height: this.props.pickedCardHeight,
          left: this.props.pickedCardPosition.x,
          top: this.props.pickedCardPosition.y,
          transform: `rotateX(${this.props.pickedCardRotation.x}deg) rotateY(${this.props.pickedCardRotation.y}deg)`,
          // transition: 'transform 0.1s ease',
          pointerEvents: 'none'
        }}/>}
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
  pickedCardRotation: state.cards.pickedCardRotation,
  perspectiveOrigin: `${state.cards.perspectiveOrigin.x}px ${state.cards.perspectiveOrigin.y}px`
})

const mapDispatchToProps = dispatch => ({
  drawCard: () => dispatch(actionCreators.drawCard()),
  unpickCard: () => dispatch(actionCreators.unpickCard()),
  moveCard: cumulativeRafSchd((x, y) => dispatch(actionCreators.moveCard(x, y))),
  resetRotation: debounce(() => { dispatch(actionCreators.resetRotation()) }, 120)
})

export default connect(mapStateToProps, mapDispatchToProps)(Scene)
