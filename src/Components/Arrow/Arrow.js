import React from 'react'
import styles from './Arrow.module.css'
import ArrowHead from './ArrowHead'
import ArrowPiece from './ArrowPiece'

class Arrow extends React.Component {
  render () {
    const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = [this.props.from, this.props.to]
    const distance = Math.hypot(x2 - x1, y2 - y1)
    const angle = Math.atan2(x1 - x2, y2 - y1)
    return (
      <div className={styles.Container} style={{
        left: x1 + 'px',
        top: y1 + 'px',
        height: distance + 'px',
        transform: `translateX(-50%) rotate(${angle}rad)`
      }}>
        <ArrowPiece className={styles.Piece}/>
        <ArrowPiece className={styles.Piece}/>
        <ArrowPiece className={styles.Piece}/>
        <ArrowPiece className={styles.Piece}/>
        <ArrowPiece className={styles.Piece}/>
        <ArrowHead className={styles.Head}/>
      </div>
    )
  }
}

export default Arrow
