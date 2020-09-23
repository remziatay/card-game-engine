import React from 'react'
import Card from '../Card/Card'
import styles from './Hand.module.css'

class Hand extends React.Component {
  getGrid () {
    const cardGrid = 6
    let cardOverflow
    switch (this.props.cards.length) {
      case 1: case 2:
        cardOverflow = 7
        break
      case 3: case 4:
        cardOverflow = 4
        break
      case 5: case 6:
        cardOverflow = 3
        break
      default: cardOverflow = 2
    }
    return { cardGrid, cardOverflow }
  }

  calculateColumn = n => {
    const start = this.getGrid().cardOverflow * n + 1
    return `${start} / ${start + this.getGrid().cardGrid}`
  }

  calculateRotate = n => {
    const middle = (this.props.cards.length + 1) / 2
    if (n === middle || this.getGrid().cardGrid <= this.getGrid().cardOverflow) return 'rotate(0)'
    const degree = Math.sign(n - middle) * 2 + Math.trunc(n - middle) * 3
    const push = Math.abs(n - middle) ** 3 * 0.05
    return `rotate(${degree}deg) translateY(${push}%)`
  }

  calculateOrigin = n => {
    const middle = (this.props.cards.length + 1) / 2
    if (n === middle) return 'center'
    return n - middle > 0 ? 'bottom left' : 'bottom right'
  }

  render () {
    const widthRate = 1 + (this.props.cards.length - 1) * this.getGrid().cardOverflow / this.getGrid().cardGrid
    return (
      <div className={styles.Hand} style={{ width: `calc(${this.props.cardWidth} * ${widthRate})` }}>
        {
          this.props.cards.map((card, i) =>
            <Card key={card.key} num={i + 1} cardWidth={parseFloat(this.props.cardWidth)} style={{
              gridColumn: this.calculateColumn(i),
              transform: this.calculateRotate(i + 1),
              transformOrigin: this.calculateOrigin(i + 1),
              height: 1.5 * parseFloat(this.props.cardWidth)
            }}/>
          )
        }
      </div>
    )
  }
}

export default Hand
