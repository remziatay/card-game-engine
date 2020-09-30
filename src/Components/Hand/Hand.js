import React from 'react'
import { connect } from 'react-redux'
import Card from '../Card/Card'
import FocusableCard from '../Card/FocusableCard'
import styles from './Hand.module.css'

class Hand extends React.Component {
  state={
    lastCard: null,
    lastSize: 0
  }

  setRef = ref => {
    this.setState({ lastCard: ref })
  }

  componentDidUpdate () {
    if (this.props.cards.length < this.state.lastSize) {
      return this.setState({
        lastCard: null,
        lastSize: this.props.cards.length
      })
    }
    if (!this.state.lastCard || this.props.cards.length === this.state.lastSize) return
    const card = this.state.lastCard
    const rect = card.getBoundingClientRect()
    card.parentNode.animate([
      {
        position: 'absolute',
        left: this.props.deckPosition.x - rect.left + 'px',
        bottom: -(this.props.deckPosition.y - rect.top) + 'px',
        transform: 'none',
        fontSize: this.props.size
      },
      {
        offset: 0.25,
        left: '-50%',
        bottom: '105%',
        transform: 'none',
        fontSize: `calc(2.5 * ${this.props.size})` // TODO THIS CAN BE FIXED ON STORE
      },
      {
        offset: 0.90,
        left: '-50%',
        bottom: '105%',
        transform: 'none',
        fontSize: `calc(2.5 * ${this.props.size})`
      },
      {
        position: 'absolute',
        left: '0px',
        bottom: '0px'
      }
    ], 2500)

    card.animate([
      { transform: 'rotateX(0deg)  rotateY(180deg)' },
      { transform: 'rotateX(45deg)  rotateY(225deg)' },
      { transform: 'rotateX(90deg) rotateY(270deg)' },
      {
        offset: 0.25,
        transform: 'rotateX(0deg)  rotateY(360deg)'
      },
      {
        offset: 0.90,
        transform: 'rotateX(0deg)  rotateY(360deg)'
      },
      { transform: 'rotateX(0deg)  rotateY(360deg)' }
    ], 2500)
    // .finished.then(() => console.log('anim')) NO, USE ONFINISH
    this.setState({
      lastCard: null,
      lastSize: this.props.cards.length
    })
  }

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
      const last = i === this.props.cards.length - 1
      if (this.props.pickedIndex >= 0 && i > this.props.pickedIndex) i--
      return (
        <FocusableCard {...(last ? { setRef: this.setRef, hasBackface: true } : {})}
          key={card.key} info={card} focused={focused} picked={picked}
          containerStyle={{
            fontSize: this.props.size,
            gridColumn: this.calculateColumn(i),
            transform: this.calculateRotate(i),
            transformOrigin: this.calculateOrigin(i),
            zIndex: 3,
            perspective: '500px',
            marginBottom: '-30%'
          }}
          style={{
            border: '2px solid black'
          }}/>)
    })

    return (
      <div className={styles.Hand} style={{ gridTemplateColumns: `repeat(${this.props.columnCount}, 1fr)` }}>
        {/* To keep container height even when it's empty */}
        <Card noContent containerStyle={{
          fontSize: this.props.size,
          gridColumn: this.calculateColumn(0),
          opacity: 0,
          marginBottom: '-30%'
        }}/>
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
    columnCount: state.cards.cardGrid + (cardCount - 1) * cardOverflow,
    deckPosition: state.cards.deckPosition,
    size: state.cards.handSize
  }
}

export default connect(mapStateToProps)(Hand)
