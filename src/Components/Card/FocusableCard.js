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
      onMouseLeave: this.unfocus,
      ref: this.props.setRef
    }
    return (
      <>
        <Card info={this.props.info} passProps={passProps} hasBackface={this.props.hasBackface}
          containerStyle={this.props.containerStyle}
          style={{
            ...this.props.style,
            opacity: this.props.focused ? 0 : 1,
            display: this.props.picked ? 'none' : ''
          }}/>

        {
          this.props.focused && <Card info={this.props.info}
            containerStyle={{
              ...this.props.containerStyle,
              position: 'relative',
              transform: 'none',
              transformOrigin: 'center',
              left: '-75%',
              bottom: '225%',
              pointerEvents: 'none',
              zIndex: 4
            }}
            style={{
              width: '250%',
              height: '250%'
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
