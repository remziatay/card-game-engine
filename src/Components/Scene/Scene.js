import React from 'react'
import styles from './Scene.module.css'
import { actionCreators } from '../../store/actions'
import { connect } from 'react-redux'
import Board from '../Board/Board'
import Card from '../Card/Card'
import cumulativeRafSchd from '../../lib/cumulativeRafSchd'
import { debounce } from '../../lib/util'
import BottomPane from '../BottomPane/BottomPane'

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
        <div onMouseMove={this.mouseMove} onMouseUp={this.mouseUp} className={styles.Scene} >
          <div>
            <button onClick={this.props.drawCard}>Draw Card</button>
          </div>
          <Board/>
          <BottomPane/>
        </div>

        {this.props.pickedCard &&
            <Card info={this.props.pickedCard} containerStyle={{
              position: 'fixed',
              left: this.props.pickedCardPosition.x,
              top: this.props.pickedCardPosition.y,
              pointerEvents: 'none'
            }}
            style={{
              width: this.props.pickedCardWidth,
              height: this.props.pickedCardHeight,
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
  pickedCardRotation: `rotateX(${state.cards.pickedCardRotation.x}deg) rotateY(${state.cards.pickedCardRotation.y}deg)`
})

const mapDispatchToProps = dispatch => ({
  drawCard: () => dispatch(actionCreators.drawCard()),
  unpickCard: () => dispatch(actionCreators.unpickCard()),
  moveCard: cumulativeRafSchd((x, y) => dispatch(actionCreators.moveCard(x, y))),
  resetRotation: debounce(() => { dispatch(actionCreators.resetRotation()) }, 120)
})

export default connect(mapStateToProps, mapDispatchToProps)(Scene)
