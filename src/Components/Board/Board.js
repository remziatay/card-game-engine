import React from 'react'
import { connect } from 'react-redux'
import cumulativeRafSchd from '../../lib/cumulativeRafSchd'
import { actionCreators } from '../../store/actions'
import styles from './Board.module.css'
import Pawn from './Pawn'

class Board extends React.Component {
  state = {
    columns: []
  }

  ref = React.createRef()

  setColumns = cumulativeRafSchd(() => {
    const columns = Array.from(this.ref.current.children).map(card => {
      const rect = card.getBoundingClientRect()
      return rect.left + rect.width / 2
    })
    this.setState({ columns })
  })

  componentDidUpdate () {
    if (this.props.board.length === this.state.columns.length) return
    this.setColumns()
  }

  componentDidMount () {
    window.addEventListener('resize', this.setColumns)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setColumns)
  }

  mouseUp = evt => {
    evt.stopPropagation()
    if (this.props.pickedCard) {
      this.orderFakeCard.cancel()
      this.props.putCard()
    }
  }

  orderFakeCard = cumulativeRafSchd(evt => {
    let index = this.state.columns.findIndex(x => evt.pageX < x)
    if (index === -1) index = this.state.columns.length
    this.props.moveFakeCard(index)
  })

  mouseMove = evt => {
    if (!this.state.columns.length || !this.props.pickedCard || this.props.board.length === 5) return
    evt.persist()
    this.orderFakeCard(evt)
  }

  mouseLeave = () => {
    if (!this.state.columns.length || !this.props.pickedCard || this.props.board.length === 5) return
    this.orderFakeCard.cancel()
    this.props.moveFakeCard(null)
  }

  render () {
    const fakeCard = this.props.fakeCard && (
      <Pawn noContent style={{
        order: this.props.fakeCardOrder,
        fontSize: this.props.cardSize
      }}
      />
    )
    return (
      <div className={styles.Board}>
        <div className={styles.Line} style={{ borderBottom: '3px dotted gray' }}>
          {this.props.opponentBoard.map((card, _) => (
            <Pawn key={card.key} info={card} style={{ fontSize: this.props.cardSize }}/>
          ))}
        </div>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div ref={this.ref} onMouseMove={this.mouseMove} onMouseUp={this.mouseUp}
          onMouseLeave={this.mouseLeave} className={styles.Line}>
          {this.props.board.map((card, i) => (
            <Pawn key={card.key} info={card} style={{
              order: 2 * i,
              fontSize: this.props.cardSize
            }}/>
          ))}
          { fakeCard }
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
  cardSize: state.cards.pickSize
})

const mapDispatchToProps = dispatch => ({
  moveFakeCard: index => dispatch(actionCreators.moveFakeCard(index)),
  putCard: () => dispatch(actionCreators.putCard())
})

export default connect(mapStateToProps, mapDispatchToProps)(Board)
