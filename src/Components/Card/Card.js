import React from 'react'
import styles from './Card.module.css'

class Card extends React.Component {
  state = {
    center: 0,
    focused: false
  }

  ref = React.createRef()

  focus = () => {
    const rect = this.ref.current.getBoundingClientRect()
    this.setState({
      focused: true,
      center: rect.left + rect.width / 2
    })
  }

  unfocus = () => {
    this.setState({ focused: false })
  }

  render () {
    const style = { }
    if (this.state.focused) {
      Object.assign(style, {
        position: 'absolute',
        left: this.state.center - parseFloat(this.props.cardWidth) / 2,
        width: this.props.cardWidth,
        transformOrigin: 'center',
        transform: 'scale(120%) translateY(-60px)',
        transition: 'none',
        zIndex: 2,
        pointerEvents: 'none'
      })
    }
    return (
      <>
        <div ref={this.ref} onMouseEnter={this.focus} onMouseLeave={this.unfocus} className={styles.Card} style={{ ...this.props.style, opacity: this.state.focused ? 0 : 1 }}>
          {this.props.num}. Card
        </div>
        {this.state.focused &&
        <div className={styles.Card} style={style}>
          Focused {this.props.num}. Card
        </div>
        }
      </>
    )
  }
}

export default Card
