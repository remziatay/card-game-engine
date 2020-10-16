import React from 'react'
import { connect } from 'react-redux'
import { actionCreators } from '../../store/actions'
import styles from './Pawn.module.css'
import skull from './skull.svg'

class Pawn extends React.Component {
  mouseDown = () => {
    if (this.props.opponent || this.props.info?.sleeping || !this.props.turn) return
    this.props.pickPawn(this.props.info.key)
  }

  mouseUp = evt => {
    if (!this.props.opponent || !this.props.pickedPawn || !this.props.turn) return
    this.props.attack(this.ref.current)
  }

  mouseEnter = evt => {
    if (!this.props.opponent || !this.props.pickedPawn) return
    this.props.focusPawn(this.props.info.key)
  }

  mouseLeave = evt => {
    if (!this.props.opponent || !this.props.pickedPawn) return
    this.props.focusPawn(null)
  }

  ref = React.createRef()

  componentDidUpdate () {
    if (this.props.info?.dead) {
      this.ref.current.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], {
        duration: 800,
        fill: 'forwards'
      }).onfinish = () => this.props.removePawn(this.props.info.key)
    }
  }

  render () {
    const dies = (this.props.focusedPawn?.key === this.props.info?.key && this.props.focusedPawn?.dies) ||
    (this.props.picked && this.props.pickedPawn?.dies)
    return (
      <div role='button' tabIndex={0} ref={this.ref} className={styles.Egg} style={{
        ...this.props.style,
        outline: 'none',
        background: this.props.info?.background,
        transform: this.props.picked && 'scale(1.2, 1.2)',
        boxShadow: !this.props.turn || this.props.noContent || this.props.opponent || (!this.props.info?.sleeping
          ? '0 0 8px 4px green' : this.props.picked && '0 4px 2px 0 rgba(0,0,0,0.5)')
      }}
      onMouseDown={this.mouseDown}
      onMouseUp={this.mouseUp}
      onMouseEnter={this.mouseEnter}
      onMouseLeave={this.mouseLeave} >
        { this.props.noContent || <>
          <div className={styles.Float + ' ' + styles.Attack}>{this.props.info.attack}</div>
          <div className={styles.Float + ' ' + styles.Health}>{this.props.info.health}</div>
          {dies && <img alt='dies' src={skull}/>}
        </>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  focusedPawn: state.cards.focusedPawn,
  pickedPawn: state.cards.pickedPawn,
  turn: state.cards.turn
})

const mapDispatchToProps = dispatch => ({
  pickPawn: key => dispatch(actionCreators.pickPawn(key)),
  focusPawn: key => dispatch(actionCreators.focusPawn(key)),
  removePawn: key => dispatch(actionCreators.removePawn(key))
})

export default connect(mapStateToProps, mapDispatchToProps)(Pawn)
