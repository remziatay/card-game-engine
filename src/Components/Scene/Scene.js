import React from 'react'
import Hand from '../Hand/Hand'
import styles from './Scene.module.css'
import * as actionCreators from '../../store/actions'
import { connect } from 'react-redux'

class Scene extends React.Component {
  state = {
    cardCount: 6
  }

  render () {
    return (
      <>
        <div className={styles.Scene}>
          <div>
            <button onClick={this.props.drawCard}>Draw Card</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minWidth: '100%' }}>
            <Hand cardWidth="100px"/>
          </div>
        </div>
      </>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  drawCard: () => dispatch(actionCreators.drawCard())
})

export default connect(null, mapDispatchToProps)(Scene)
