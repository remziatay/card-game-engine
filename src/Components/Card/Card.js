import React from 'react'
import styles from './Card.module.css'

class Card extends React.Component {
  render () {
    return (
      <>
        <div className={`${styles.Card} ${this.props.empty ? styles.Empty : ''}`} style={this.props.style} {...this.props.passProps}>
          {this.props.info?.title}
          {this.props.hasBackface &&
            <div className={styles.Backface} style={{ boxShadow: this.props.style.boxShadow }}>
            BACKFACE
            </div>
          }
        </div>
      </>

    )
  }
}

export default Card
