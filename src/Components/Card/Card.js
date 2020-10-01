import React from 'react'
import styles from './Card.module.css'
import texture from './card-texture.jpg'

class Card extends React.Component {
  render () {
    return (
      <div className={styles.Container} style={this.props.containerStyle}>
        <div className={`${styles.Card} ${this.props.noContent ? styles.Empty : ''}`} style={this.props.style} {...this.props.passProps}>
          { this.props.noContent ||
          <>
            <div className={styles.Egg} style={{ background: this.props.info.background }}></div>
            <div className={styles.Text}>{this.props.info?.title}</div>
            <div className={styles.Float + ' ' + styles.Attack}>{this.props.info.attack}</div>
            <div className={styles.Float + ' ' + styles.Health}>{this.props.info.health}</div>
            <div className={styles.Float + ' ' + styles.Mana}>{this.props.info.mana}</div>
          </>
          }
          {this.props.hasBackface &&
            <div className={styles.Backface} style={{
              background: `url(${texture})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'repeat'
            }}>
            </div>
          }
        </div>
      </div>

    )
  }
}

export default Card
