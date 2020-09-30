import React from 'react'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/actions'
import styles from './Pawn.module.css'

class Pawn extends React.Component {
  mouseDown = () => {
    if (this.props.opponent) return
    this.props.pickPawn(this.props.info)
  }

  mouseUp = evt => {
    if (!this.props.opponent || !this.props.pickedPawn) return
    this.props.attack(this.props.info)
  }

  render () {
    return (
      <div role='button' tabIndex={0} className={styles.Egg} style={{
        ...this.props.style,
        background: this.props.info?.background,
        transform: this.props.picked && 'scale(1.2, 1.2)',
        boxShadow: this.props.picked && '0 4px 2px 0 rgba(0,0,0,0.5)'
      }}
      onMouseDown={this.mouseDown}
      onMouseUp={this.mouseUp} >
        { this.props.noContent || <>
          <div className={styles.Float + ' ' + styles.Ball}>6</div>
          <div className={styles.Float + ' ' + styles.Ball2}>8</div>
        </>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  pickedPawn: state.cards.pickedPawn
})

const mapDispatchToProps = dispatch => ({
  pickPawn: pawn => dispatch(actionCreators.pickPawn(pawn))
})

export default connect(mapStateToProps, mapDispatchToProps)(Pawn)
