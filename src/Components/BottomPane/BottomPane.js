import React from 'react'
import { connect } from 'react-redux'
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
            flexFlow: 'column-reverse nowrap',
            alignItems: 'center',
            gap: '0.5em',
            minHeight: '0px'
          }}>
            <Hand/>
            <img alt='CHAR' src={char} style={{
              border: '3px solid brown',
              borderRadius: '50% 50% 0 0',
              padding: '0.3em',
              fontSize: this.props.cardSize,
              width: '13em',
              height: '17.5em'
            }}/>
          </div>
          <div className={styles.Container} >
            <Deck/>
          </div>

        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({
  cardSize: state.cards.pickSize
})

export default connect(mapStateToProps)(BottomPane)
