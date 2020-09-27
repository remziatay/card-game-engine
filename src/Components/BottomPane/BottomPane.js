import React from 'react'
import Hand from '../Hand/Hand'
import styles from './BottomPane.module.css'
import Deck from './Deck/Deck'

class BottomPane extends React.Component {
  render () {
    return (
      <>
        <div className={styles.BottomPane}>
          <div className={styles.Container}> MANA STUFF </div>
          <div className={styles.Container} style={{ alignSelf: 'flex-end', zIndex: 2 }}>
            <Hand/>
          </div>
          <div className={styles.Container} >
            <Deck/>
          </div>

        </div>
      </>
    )
  }
}

export default BottomPane
