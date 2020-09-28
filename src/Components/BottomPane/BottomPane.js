import React from 'react'
import Hand from '../Hand/Hand'
import styles from './BottomPane.module.css'
import Deck from './Deck/Deck'
import char from './test.svg'

class BottomPane extends React.Component {
  render () {
    return (
      <>
        <div className={styles.BottomPane}>
          <div className={styles.Container}> MANA STUFF </div>
          <div className={styles.Container} style={{
            zIndex: 2,
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'center',
            gap: '0.5em'
          }}>
            <img alt='CHAR' src={char} style={{
              border: '3px solid brown',
              borderRadius: '50% 50% 0 0',
              padding: '0.2em',
              width: '100px',
              height: '120px'
            }}/>
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
