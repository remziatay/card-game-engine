import React from 'react'
import { connect } from 'react-redux'
import Card from '../Card/Card'
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
    const widthRate = 1 + (this.props.cardCount - 1) * this.props.cardOverflow / this.props.cardGrid
    const filteredHand = this.props.cards.map((card, i) => {
      const picked = this.props.pickedIndex === i
      if (this.props.pickedIndex >= 0 && i > this.props.pickedIndex) i--
      return (
        <Card key={card.key} info={card} picked={picked}
          cardWidth={parseFloat(this.props.cardWidth)}
          style={{
            gridColumn: this.calculateColumn(i),
            transform: this.calculateRotate(i),
            transformOrigin: this.calculateOrigin(i),
            height: 1.5 * parseFloat(this.props.cardWidth)
          }}/>)
    })

    return (
      <div className={styles.Hand} style={{ width: `calc(${this.props.cardWidth} * ${widthRate})` }}>
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
  const pickedIndex = state.cards.hand.findIndex(card => card.key === state.cards.pickedCard)
  const cardCount = state.cards.hand.length - (pickedIndex !== -1)
  return {
    cards: state.cards.hand,
    pickedIndex,
    cardCount,
    cardGrid: state.cards.cardGrid,
    cardOverflow: calculateOverFlow(cardCount)
  }
}

export default connect(mapStateToProps)(Hand)
