import React from 'react'
import { connect } from 'react-redux'
import cumulativeRafSchd from '../../../lib/cumulativeRafSchd'
import { actionCreators } from '../../../store/actions'
import Card from '../../Card/Card'

class Deck extends React.Component {
  setRef = ref => {
    this.card = ref
  }

  setPosition = () => {
    const rect = this.card.getBoundingClientRect()
    this.props.setDeckPosition({ x: rect.left, y: rect.top })
  }

  componentDidMount () {
    this.setPosition()
    this._setPosition = cumulativeRafSchd(this.setPosition)
    window.addEventListener('resize', this._setPosition)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._setPosition)
  }

  render () {
    return (
      <div>
        <Card hasBackface passProps={{ ref: this.setRef }}
          containerStyle={{ margin: '1em 0' }}
          style={{
            border: 'none',
            width: this.props.cardWidth,
            height: this.props.cardHeight,
            boxShadow: this.props.boxShadow,
            transform: 'rotateY(180deg)'
          }}/>
      </div>
    )
  }
}

const createBoxShadow = (color, deckSize) => {
  const shadowSize = deckSize < 10 ? deckSize : Math.floor(Math.max(10, deckSize / 2))
  return Array(shadowSize).fill().map((_, i) => {
    const end = i % 2 === 0 ? color : '0 0.65px'
    i = Math.floor(i / 2) + 1
    return `-${i}px ${i}px ${end}`
  }).join()
}

const mapStateToProps = state => ({
  cardWidth: state.cards.cardWidth,
  cardHeight: state.cards.cardWidth * state.cards.cardRatio,
  empty: state.cards.deck.length === 0,
  boxShadow: createBoxShadow(state.cards.cardShadowColor, state.cards.deck.length)
})

const mapDispatchToProps = dispatch => ({
  drawCard: () => dispatch(actionCreators.drawCard()),
  unpickCard: () => dispatch(actionCreators.unpickCard()),
  setDeckPosition: pos => dispatch(actionCreators.setDeckPosition(pos))
})

export default connect(mapStateToProps, mapDispatchToProps)(Deck)
