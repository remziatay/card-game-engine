import React from 'react'
import './App.css'
import Hand from './Components/Hand/Hand'

class App extends React.Component {
  state = {
    cardCount: 6
  }

  render () {
    const cards = new Array(this.state.cardCount).fill().map((k, i) => ({ key: i }))
    return (
      <>
        <button onClick={() => { this.setState(state => ({ cardCount: state.cardCount + 1 })) }}>+</button>
        <button onClick={() => { this.setState(state => ({ cardCount: state.cardCount - 1 })) }}>-</button>
        <div style={{ display: 'flex', justifyContent: 'center', position: 'absolute', bottom: -20, minWidth: '100%' }}>
          <Hand cardWidth="200px" cards={cards}/>
        </div>
      </>
    )
  }
}

export default App
