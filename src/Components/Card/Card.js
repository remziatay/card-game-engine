import React from 'react'
import styles from './Card.module.css'

class Card extends React.Component {
  render () {
    return (
      <>
        <div className={styles.Card} style={this.props.style} {...this.props.passProps}>
          {this.props.info.title}
        </div>
      </>
    )
  }
}

export default Card
