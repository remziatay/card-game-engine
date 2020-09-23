import React from 'react'
import cumulativeRafSchd from '../../lib/cumulativeRafSchd'
import styles from './Card.module.css'

class Card extends React.Component {
  state = {
    center: 0,
    focused: false,
    picked: false
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
      this.setState({ picked: true, focused: false })
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
    this.setState({ picked: false })
  }

  render () {
    let style = { }
    if (this.state.focused) {
      style = {
        left: this.state.center - 2.5 * this.props.cardWidth / 2,
        bottom: '20%'
      }
    } else if (this.state.picked) {
      style = {
        position: 'fixed',
        left: this.state.x,
        top: this.state.y
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
            opacity: (this.state.focused || this.state.picked) ? 0 : 1,
            display: this.state.picked ? 'none' : ''
          }}>
          {this.props.num}. Card
        </div>

        {(this.state.focused || this.state.picked) &&
        <div className={styles.Card} style={{
          position: 'absolute',
          width: 2.5 * this.props.cardWidth + 'px',
          height: 2.5 * this.props.style.height + 'px',
          zIndex: 2,
          pointerEvents: 'none',
          ...style
        }}>
          {this.state.focused ? 'Focused' : 'Picked'} {this.props.num}. Card
        </div>
        }
      </>
    )
  }
}

export default Card
