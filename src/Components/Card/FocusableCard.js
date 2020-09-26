import React from 'react'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/actions'
import Card from './Card'

class FocusableCard extends React.Component {
  state = {
    center: 0
  }

  focus = evt => {
    if (this.props.pickedCard) return
    this.props.focusCard(this.props.info)
    this.setState({ center: evt.pageX })
  }

  unfocus = () => {
    this.props.focusCard(null)
  }

  mouseDown = evt => {
    this.props.pickCard()
    this.props.moveCard(evt.pageX, evt.pageY)
  }

  render () {
    const passProps = {
      role: 'button',
      tabIndex: 0,
      onMouseDown: this.mouseDown,
      onMouseEnter: this.focus,
      onMouseLeave: this.unfocus
    }
    return (
      <>
        <Card info={this.props.info} passProps={passProps} style={{
          ...this.props.style,
          opacity: (this.props.focused || this.props.picked) ? 0 : 1,
          display: this.props.picked ? 'none' : ''
        }}/>

        {
          this.props.focused && <Card info={this.props.info} style={{
            position: 'absolute',
            left: this.state.center - this.props.focusedCardWidth / 2,
            bottom: '5%',
            width: this.props.focusedCardWidth + 'px',
            height: this.props.focusedCardHeight + 'px',
            zIndex: 2,
            pointerEvents: 'none'
          }}/>
        }
      </>
    )
  }
}

const mapStateToProps = state => ({
  pickedCard: state.cards.pickedCard
})

const mapDispatchToProps = dispatch => ({
  focusCard: card => dispatch(actionCreators.focusCard(card)),
  pickCard: () => dispatch(actionCreators.pickCard()),
  moveCard: (x, y) => dispatch(actionCreators.moveCard(x, y))
})

export default connect(mapStateToProps, mapDispatchToProps)(FocusableCard)
