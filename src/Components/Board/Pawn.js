import React from 'react'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/actions'
import styles from './Pawn.module.css'

class Pawn extends React.Component {
  mouseDown = () => {
    if (this.props.opponent || this.props.info?.sleeping) return
    this.props.pickPawn(this.props.info)
  }

  mouseUp = evt => {
    if (!this.props.opponent || !this.props.pickedPawn) return
    this.props.attack()
  }

  mouseEnter = evt => {
    if (!this.props.opponent || !this.props.pickedPawn) return
    this.props.focusPawn(this.props.info)
  }

  mouseLeave = evt => {
    if (!this.props.opponent || !this.props.pickedPawn) return
    this.props.focusPawn(null)
  }

  render () {
    return (
      <div role='button' tabIndex={0} className={styles.Egg} style={{
        ...this.props.style,
        background: this.props.info?.background,
        transform: this.props.picked && 'scale(1.2, 1.2)',
        boxShadow: this.props.noContent || this.props.opponent || (!this.props.info?.sleeping
          ? '0 0 8px 4px green' : this.props.picked && '0 4px 2px 0 rgba(0,0,0,0.5)')
      }}
      onMouseDown={this.mouseDown}
      onMouseUp={this.mouseUp}
      onMouseEnter={this.mouseEnter}
      onMouseLeave={this.mouseLeave} >
        { this.props.noContent || <>
          <div className={styles.Float + ' ' + styles.Attack}>{this.props.info.attack}</div>
          <div className={styles.Float + ' ' + styles.Health}>{this.props.info.health}</div>
        </>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  pickedPawn: state.cards.pickedPawn
})

const mapDispatchToProps = dispatch => ({
  pickPawn: pawn => dispatch(actionCreators.pickPawn(pawn)),
  focusPawn: pawn => dispatch(actionCreators.focusPawn(pawn))
})

export default connect(mapStateToProps, mapDispatchToProps)(Pawn)
