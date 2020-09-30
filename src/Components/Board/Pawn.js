import React from 'react'
import styles from './Pawn.module.css'

class Pawn extends React.Component {
  render () {
    return (
      <div className={styles.Egg} style={{ ...this.props.style, background: this.props.info?.background }}>
        { this.props.noContent || <>
          <div className={styles.Float + ' ' + styles.Ball}>6</div>
          <div className={styles.Float + ' ' + styles.Ball2}>8</div>
        </>}
      </div>
    )
  }
}

export default Pawn
