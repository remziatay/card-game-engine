import React from 'react'
import { connect } from 'react-redux'
import cumulativeRafSchd from '../../lib/cumulativeRafSchd'
import { actionCreators } from '../../store/actions'
import styles from './Board.module.css'
import Pawn from './Pawn'

class Board extends React.Component {
  state = {
    pawnPositions: [],
    opponentPositions: []
  }

  ref = React.createRef()
  opRef = React.createRef()

  updateColumns = () => {
    // Sort of a memo function for positions
    const boards = [
      { length: this.props.board.length, children: this.ref.current.children, key: 'pawnPositions' },
      { length: this.props.opponentBoard.length, children: this.opRef.current.children, key: 'opponentPositions' }
    ]
    let changed = false
    const pushChanges = () => {
      if (!changed) return
      this.props.setPawnPositions(
        this.state.pawnPositions[this.props.board.length],
        this.state.opponentPositions[this.props.opponentBoard.length]
      )
    }

    boards.forEach(({ length, children, key }) => {
      if (this.state[key][length]) return
      changed = true
      const columns = Array.from(children).map(card => {
        const rect = card.getBoundingClientRect()
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      })
      this.setState(state => {
        const positions = [...state[key]]
        positions[length] = columns
        return { [key]: Array.from(positions) }
      }, pushChanges)
    })
  }

  resetColumns = cumulativeRafSchd(() => {
    this.setState({ pawnPositions: [], opponentPositions: [] }, this.updateColumns)
  })

  componentDidUpdate () {
    this.updateColumns()
  }

  componentDidMount () {
    window.addEventListener('resize', this.resetColumns)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resetColumns)
  }

  mouseUp = evt => {
    if (this.props.pickedCard) {
      evt.stopPropagation()
      this.orderFakeCard.cancel()
      this.props.putCard()
    }
  }

  orderFakeCard = cumulativeRafSchd(evt => {
    let index = this.state.pawnPositions[this.props.board.length].findIndex(({ x }) => evt.pageX < x)
    if (index === -1) index = this.state.pawnPositions[this.props.board.length].length
    this.props.moveFakeCard(index)
  })

  mouseMove = evt => {
    if (!this.props.pickedCard || this.props.board.length === 5) return
    evt.persist()
    this.orderFakeCard(evt)
  }

  mouseLeave = () => {
    if (!this.props.pickedCard || this.props.board.length === 5) return
    this.orderFakeCard.cancel()
    this.props.moveFakeCard(null)
  }

  attack = (opponentNode) => {
    const pawn = this.ref.current.children[this.props.board.findIndex(card => card.key === this.props.pickedPawn.key)]
    this.props.attack(pawn, opponentNode)
  }

  render () {
    const fakePawn = this.props.fakeCard && (
      <Pawn noContent style={{
        order: this.props.fakeCardOrder,
        fontSize: this.props.cardSize
      }}/>
    )

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div className={styles.Board} onMouseMove={this.mouseMove} onMouseUp={this.mouseUp}
        onMouseLeave={this.mouseLeave}>
        <div ref={this.opRef} className={styles.Line} style={{ borderBottom: '3px dotted gray' }}>
          {this.props.opponentBoard.map(card =>
            <Pawn opponent attack={this.attack} key={card.key} info={card}
              style={{ fontSize: this.props.cardSize }}/>)}
        </div>
        <div ref={this.ref} className={styles.Line}>
          {this.props.board.map((card, i) => (
            <Pawn key={card.key} info={card} picked={this.props.pickedPawn?.key === card.key} style={{
              order: 2 * i,
              fontSize: this.props.cardSize
            }}/>
          ))}
          { fakePawn }
        </div>
      </div>
    )
  }
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
