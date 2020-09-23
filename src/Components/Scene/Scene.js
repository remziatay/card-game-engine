import React from 'react'
import Hand from '../Hand/Hand'
import styles from './Scene.module.css'

class Scene extends React.Component {
  state = {
    cardCount: 6
  }

  render () {
    const cards = new Array(this.state.cardCount).fill().map((k, i) => ({ key: i }))
    return (
      <>
        <div className={styles.Scene}>
          <div>
            <button onClick={() => { this.setState(state => ({ cardCount: state.cardCount + 1 })) }}>+</button>
            <button onClick={() => { this.setState(state => ({ cardCount: state.cardCount - 1 })) }}>-</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minWidth: '100%' }}>
            <Hand cardWidth="100px" cards={cards}/>
          </div>
        </div>
      </>
    )
  }
}

export default Scene
