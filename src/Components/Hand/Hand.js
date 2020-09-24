import React from 'react'
import { connect } from 'react-redux'
import FocusableCard from '../Card/FocusableCard'
import styles from './Hand.module.css'

class Hand extends React.Component {
  calculateColumn = n => {
    const start = this.props.cardOverflow * n + 1
    return `${start} / ${start + this.props.cardGrid}`
  }

  calculateRotate = n => {
    n++
    const middle = (this.props.cardCount + 1) / 2
    if (n === middle || this.props.cardGrid <= this.props.cardOverflow) return 'rotate(0)'
    const degree = Math.sign(n - middle) * 2 + Math.trunc(n - middle) * 3
    const push = Math.abs(n - middle) ** 3 * 0.05
    return `rotate(${degree}deg) translateY(${push}%)`
  }

  calculateOrigin = n => {
    n++
    const middle = (this.props.cardCount + 1) / 2
    if (n === middle) return 'center'
    return (n - middle > 0) ? 'bottom left' : 'bottom right'
  }

  render () {
    const filteredHand = this.props.cards.map((card, i) => {
      const picked = this.props.pickedIndex === i
      const focused = this.props.focusedCard?.key === card.key
      if (this.props.pickedIndex >= 0 && i > this.props.pickedIndex) i--
      return (
        <FocusableCard key={card.key} info={card} focused={focused} picked={picked}
          focusedCardWidth={this.props.cardWidth * 2.5}
          focusedCardHeight={this.props.cardHeight * 2.5}
          style={{
            gridColumn: this.calculateColumn(i),
            transform: this.calculateRotate(i),
            transformOrigin: this.calculateOrigin(i),
            height: this.props.cardHeight
          }}/>)
    })

    return (
      <div className={styles.Hand} style={{ width: `${this.props.cardWidth * this.props.widthRate}px` }}>
        {filteredHand}
      </div>
    )
  }
}

const calculateOverFlow = cardCount => {
  switch (cardCount) {
    case 1: case 2: return 7
    case 3: case 4: return 4
    case 5: case 6: return 3
    default: return 2
  }
}

const mapStateToProps = state => {
  const pickedIndex = state.cards.hand.findIndex(card => card.key === state.cards.pickedCard?.key)
  const cardCount = state.cards.hand.length - (pickedIndex !== -1)
  const cardOverflow = calculateOverFlow(cardCount)
  return {
    cards: state.cards.hand,
    pickedIndex,
    cardCount,
    cardGrid: state.cards.cardGrid,
    cardOverflow,
    focusedCard: state.cards.focusedCard,
    cardWidth: state.cards.cardWidth,
    cardHeight: state.cards.cardWidth * state.cards.cardRatio,
    widthRate: 1 + (cardCount - 1) * cardOverflow / state.cards.cardGrid
  }
}

export default connect(mapStateToProps)(Hand)
