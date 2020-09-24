import React from 'react'
import { connect } from 'react-redux'
import cumulativeRafSchd from '../../lib/cumulativeRafSchd'
import styles from './Card.module.css'
import * as actionCreators from '../../store/actions'

class Card extends React.Component {
  state = {
    center: 0,
    focused: false
  }

  capturePointer = evt => { if (evt.buttons === 1) evt.target.setPointerCapture(evt.pointerId) }
  releasePointer = evt => evt.target.releasePointerCapture(evt.pointerId)

  focus = evt => {
    this.setState({
      focused: true,
      center: evt.pageX
    })
  }

  unfocus = () => {
    this.setState({ focused: false })
  }

  startDrag = () => {
    this.dragStarted = true
  }

  drag = evt => {
    if (!this.dragStarted) return
    evt.persist()
    this.pickDragging(evt)
  }

  pickDragging = cumulativeRafSchd(evt => {
    if (!this.dragging) {
      this.dragging = true
      this.setState({ focused: false }, () => this.props.pickCard(this.props.info.key))
    }
    this.setState({
      x: evt.pageX - 2.5 * this.props.cardWidth / 2,
      y: evt.pageY - 2.5 * this.props.style.height / 2
    })
  })

  endDrag = () => {
    this.pickDragging.cancel()
    this.dragStarted = false
    this.dragging = false
    this.props.pickCard(null)
  }

  render () {
    let style = {}
    if (this.props.picked) {
      style = {
        position: 'fixed',
        left: this.state.x,
        top: this.state.y
      }
    } else if (this.state.focused) {
      style = {
        left: this.state.center - 2.5 * this.props.cardWidth / 2,
        bottom: '5%'
      }
    }
    return (
      <>
        <div role='button' tabIndex={0} onPointerDown={this.capturePointer}
          onPointerUp={this.releasePointer} onMouseDown={this.startDrag}
          onMouseMove={this.drag} onMouseUp={this.endDrag} onMouseEnter={this.focus}
          onMouseLeave={this.unfocus} className={styles.Card}
          style={{
            ...this.props.style,
            opacity: (this.state.focused || this.props.picked) ? 0 : 1,
            display: this.props.picked ? 'none' : ''
          }}>
          {this.props.info.title}
        </div>

        {(this.state.focused || this.props.picked) &&
        <div className={styles.Card} style={{
          position: 'absolute',
          width: 2.5 * this.props.cardWidth + 'px',
          height: 2.5 * this.props.style.height + 'px',
          zIndex: 2,
          pointerEvents: 'none',
          ...style
        }}>
          {this.state.focused ? 'Focused' : 'Picked'} {this.props.info.title}
        </div>
        }
      </>
    )
  }
}

const mapStateToProps = null && (state => ({
  pickedCard: state.cards.pickedCard
}))

const mapDispatchToProps = dispatch => ({
  pickCard: key => dispatch(actionCreators.pickCard(key))
})

export default connect(mapStateToProps, mapDispatchToProps)(Card)
