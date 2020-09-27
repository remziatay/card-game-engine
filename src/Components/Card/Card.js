import React from 'react'
import styles from './Card.module.css'

class Card extends React.Component {
  render () {
    return (
      <div style={this.props.containerStyle}>
        <div className={`${styles.Card} ${this.props.empty ? styles.Empty : ''}`} style={this.props.style} {...this.props.passProps}>
          {this.props.info?.title}
          {this.props.hasBackface &&
            <div className={styles.Backface} >
            BACKFACE
            </div>
          }
        </div>
      </div>

    )
  }
}

export default Card
