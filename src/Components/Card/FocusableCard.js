import React from 'react'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/actions'
import Card from './Card'

class FocusableCard extends React.Component {
  state = {
    center: 0
  }

  focus = () => {
    if (this.props.pickedCard) return
    this.props.focusCard(this.props.info)
    // this.setState({ center: evt.pageX })
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
          containerStyle={{ ...this.props.containerStyle, display: this.props.picked ? 'none' : '' }}
          style={{ ...this.props.style, opacity: this.props.focused ? 0 : 1 }}/>

        {this.props.focused &&
        <>
          <Card noContent
            containerStyle={{ ...this.props.containerStyle, pointerEvents: 'none' }}
            style={this.props.style}/>

          <Card info={this.props.info}
            containerStyle={{
              ...this.props.containerStyle,
              fontSize: this.props.focusedSize,
              position: 'absolute',
              transform: 'none',
              transformOrigin: 'center',
              left: '-50%',
              bottom: '90%',
              pointerEvents: 'none',
              zIndex: 4
            }}/>
        </>
        }
      </>
    )
  }
}

const mapStateToProps = state => ({
  pickedCard: state.cards.pickedCard,
  focusedSize: state.cards.focusSize
})

const mapDispatchToProps = dispatch => ({
  focusCard: card => dispatch(actionCreators.focusCard(card)),
  pickCard: () => dispatch(actionCreators.pickCard()),
  moveCard: (x, y) => dispatch(actionCreators.moveCard(x, y))
})

export default connect(mapStateToProps, mapDispatchToProps)(FocusableCard)
