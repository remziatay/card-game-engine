import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import cumulativeRafSchd from '../../lib/cumulativeRafSchd'
import { actionCreators } from '../../store/actions'
import styles from './Board.module.css'
import Pawn from './Pawn'

function Board (props) {
  const [pawnPositions, setPawnPositions] = useState([])
  const [opponentPositions, setOpponentPositions] = useState([])

  const ref = useRef(null)
  const opRef = useRef(null)

  useEffect(() => {
    const resetColumns = cumulativeRafSchd(() => {
      setPawnPositions([])
      setOpponentPositions([])
    })
    window.addEventListener('resize', resetColumns)
    return () => window.removeEventListener('resize', resetColumns)
  }, [])

  const pushPositions = props.setPawnPositions
  useEffect(() => {
    if (!pawnPositions[props.board.length] || !opponentPositions[props.opponentBoard.length]) return
    pushPositions(pawnPositions[props.board.length], opponentPositions[props.opponentBoard.length])
  }, [opponentPositions, pawnPositions, props.board.length, props.opponentBoard.length, pushPositions])

  useEffect(() => {
    if (!pawnPositions[props.board.length]) {
      const columns = Array.from(ref.current.children).map(card => {
        const rect = card.getBoundingClientRect()
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      })
      setPawnPositions(prevPositions => {
        const positions = [...prevPositions]
        positions[props.board.length] = columns
        return Array.from(positions)
      })
    }
  }, [pawnPositions, props.board.length])

  useEffect(() => {
    if (!opponentPositions[props.opponentBoard.length]) {
      const columns = Array.from(opRef.current.children).map(card => {
        const rect = card.getBoundingClientRect()
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      })
      setOpponentPositions(prevPositions => {
        const positions = [...prevPositions]
        positions[props.opponentBoard.length] = columns
        return Array.from(positions)
      })
    }
  }, [opponentPositions, props.opponentBoard.length])

  /* componentDidUpdate () {
    updateColumns()
  }
*/

  const mouseUp = evt => {
    if (props.pickedCard) {
      evt.stopPropagation()
      orderFakeCard.cancel()
      props.putCard()
    }
  }

  const orderFakeCard = cumulativeRafSchd(evt => {
    let index = pawnPositions[props.board.length].findIndex(({ x }) => evt.pageX < x)
    if (index === -1) index = pawnPositions[props.board.length].length
    props.moveFakeCard(index)
  })

  const mouseMove = evt => {
    if (!props.pickedCard || props.board.length === 5) return
    evt.persist()
    orderFakeCard(evt)
  }

  const mouseLeave = () => {
    if (!props.pickedCard || props.board.length === 5) return
    orderFakeCard.cancel()
    props.moveFakeCard(null)
  }

  const attack = (opponentNode) => {
    const pawn = ref.current.children[props.board.findIndex(card => card.key === props.pickedPawn.key)]
    props.attack(pawn, opponentNode)
  }

  const fakePawn = props.fakeCard && (
    <Pawn noContent style={{
      order: props.fakeCardOrder,
      fontSize: props.cardSize
    }}/>
  )

  return (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className={styles.Board} onMouseMove={mouseMove} onMouseUp={mouseUp}
      onMouseLeave={mouseLeave}>
      <div ref={opRef} className={styles.Line} style={{ borderBottom: '3px dotted gray' }}>
        {props.opponentBoard.map(card =>
          <Pawn opponent attack={attack} key={card.key} info={card}
            style={{ fontSize: props.cardSize }}/>)}
      </div>
      <div ref={ref} className={styles.Line}>
        {props.board.map((card, i) => (
          <Pawn key={card.key} info={card} picked={props.pickedPawn?.key === card.key} style={{
            order: 2 * i,
            fontSize: props.cardSize
          }}/>
        ))}
        { fakePawn }
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  board: state.cards.board,
  opponentBoard: state.cards.opponentBoard,
  pickedCard: state.cards.pickedCard,
  pickedCardWidth: state.cards.pickedCardWidth,
  pickedCardHeight: state.cards.pickedCardWidth * state.cards.cardRatio,
  fakeCard: state.cards.fakeCardIndex !== null,
  fakeCardOrder: 2 * state.cards.fakeCardIndex - 1,
  cardSize: state.cards.pickSize,
  pickedPawn: state.cards.pickedPawn,
  focusedPawn: state.cards.focusedPawn
})

const mapDispatchToProps = dispatch => ({
  moveFakeCard: index => dispatch(actionCreators.moveFakeCard(index)),
  putCard: () => dispatch(actionCreators.putCard()),
  attack: (pawnNode, opponentNode) => dispatch(actionCreators.attack(pawnNode, opponentNode)),
  setPawnPositions: (pawns, opponents) => dispatch(actionCreators.setPawnPositions(pawns, opponents))
})

export default connect(mapStateToProps, mapDispatchToProps)(Board)
