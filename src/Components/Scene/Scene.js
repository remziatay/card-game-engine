import React, { useEffect, useState } from 'react'
import styles from './Scene.module.css'
import { actionCreators } from '../../store/actions'
import { connect } from 'react-redux'
import Board from '../Board/Board'
import Card from '../Card/Card'
import cumulativeRafSchd from '../../lib/cumulativeRafSchd'
import { debounce } from '../../lib/util'
import BottomPane from '../BottomPane/BottomPane'
import Arrow from '../Arrow/Arrow'

function Scene (props) {
  const [arrowTo, setArrowTo] = useState(null)

  useEffect(() => {
    if (!props.turn) return
    for (let i = 0; i < 3; i++) setTimeout(props.drawCard, 500 * (i + 1))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (props.arrow?.from && !props.arrow.to) setArrowTo({ ...props.arrow.from })
    else setArrowTo(null)
  }, [props.arrow])

  const moveArrow = cumulativeRafSchd((x, y) => setArrowTo({ x, y }))

  const mouseMove = evt => {
    if (props.arrow?.from && !props.arrow.to) moveArrow(evt.pageX, evt.pageY)

    if (props.pickedCard) {
      evt.persist()
      props.moveCard(evt.pageX, evt.pageY)
      props.resetRotation()
    }
  }

  const mouseUp = () => {
    if (props.pickedCard) props.unpickCard()
    else if (props.pickedPawn) props.unpickPawn()
  }

  return (
    <>
      { props.arrow && (props.arrow.to || arrowTo) && <Arrow from={props.arrow.from} to={props.arrow.to || arrowTo} /> }
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div onMouseMove={mouseMove} onMouseUp={mouseUp} className={styles.Scene} >
        <div>
          <button onClick={props.endTurn}>{props.turn ? 'End Turn' : 'Not Your Turn'}</button>
        </div>
        <Board/>
        <BottomPane/>
      </div>

      {props.pickedCard &&
            <Card info={props.pickedCard} containerStyle={{
              fontSize: props.pickedSize,
              position: 'fixed',
              left: props.pickedCardPosition.x,
              top: props.pickedCardPosition.y,
              pointerEvents: 'none',
              zIndex: 10,
              perspective: '500px'
            }}
            style={{
              transform: props.pickedCardRotation
            }}/>
      }
    </>
  )
}

const mapStateToProps = state => ({
  pickedCard: state.cards.pickedCard,
  pickedCardPosition: state.cards.pickedCardPosition,
  pickedCardRotation: `rotateX(${state.cards.pickedCardRotation.x}deg) rotateY(${state.cards.pickedCardRotation.y}deg)`,
  pickedSize: state.cards.pickSize,
  pickedPawn: state.cards.pickedPawn,
  turn: state.cards.turn,
  arrow: state.cards.arrow
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
