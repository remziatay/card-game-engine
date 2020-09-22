import React from 'react'
import styles from './Card.module.css'

class Card extends React.Component {
  render () {
    return (
      <div className={styles.Card} style={this.props.style}>
          A Card
      </div>
    )
  }
}

export default Card
