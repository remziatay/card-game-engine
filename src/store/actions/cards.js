import { canAttack } from '../reducers/cards'
import * as actionTypes from './actionTypes'

export const endTurn = () => {
  return { type: actionTypes.END_TURN }
}

export const drawCard = () => {
  return { type: actionTypes.DRAW_CARD }
}

export const focusCard = (card) => {
  return { type: actionTypes.FOCUS_CARD, card }
}

export const pickCard = () => {
  return { type: actionTypes.PICK_CARD }
}

export const unpickCard = () => {
  return { type: actionTypes.UNPICK_CARD }
}

export const moveCard = (x, y) => {
  return { type: actionTypes.MOVE_CARD, x, y }
}

export const resetRotation = () => {
  return { type: actionTypes.RESET_ROTATION }
}

export const moveFakeCard = (index) => {
  return { type: actionTypes.MOVE_FAKE_CARD, index }
}

export const putCard = () => {
  return { type: actionTypes.PUT_CARD }
}

export const setDeckPosition = (position) => {
  return { type: actionTypes.SET_DECK_POSITION, position }
}

export const pickPawn = (pawnKey) => {
  return { type: actionTypes.PICK_PAWN, pawnKey }
}

export const focusPawn = (pawnKey) => {
  return { type: actionTypes.FOCUS_PAWN, pawnKey }
}

export const removePawn = (pawnKey) => {
  return { type: actionTypes.REMOVE_PAWN, pawnKey }
}

export function attack (pawnNode, opponentNode) {
  return (dispatch, getState) => {
    const state = getState().cards
    if (!canAttack(state, state.pickedPawn.key, state.focusedPawn.key)) {
      return dispatch({ type: actionTypes.ATTACK_CANCEL })
    }
    const [pawn, opponent] = [state.pickedPawn, state.focusedPawn]
    dispatch({ type: actionTypes.ATTACK_START, pawnKey: pawn.key, opponentKey: opponent.key })

    pawnNode.style.transform = 'none'
    const rect = pawnNode.getBoundingClientRect()
    const opRect = opponentNode.getBoundingClientRect()
    const angle = Math.atan2(opRect.left - rect.left, rect.top - opRect.top)
    const distance = Math.hypot(opRect.top + opRect.height / 2 - rect.top, opRect.left - rect.left)
    const animation = pawnNode.animate([
      {
        transform: 'none',
        zIndex: 10
      },
      {
        offset: 0.5,
        transform: `rotate(${angle}rad) translateY(${distance * 0.2}px)`
      },
      {
        offset: Math.min(0.75, 0.5 + distance / 8000),
        transform: `rotate(${angle}rad) translateY(${-distance}px)`
      },
      {
        offset: Math.min(1, 0.5 + 6 * distance / 8000),
        transform: `rotate(${angle}rad) translateY(0px)`,
        zIndex: 10
      }
    ], 800)
    animation.onfinish = () => {
      dispatch({ type: actionTypes.ATTACK, pawnKey: pawn.key, opponentKey: opponent.key })
      if (getState().cards.animation === pawn.key + '-' + opponent.key) {
        dispatch({ type: actionTypes.ATTACKS_END })
      }
    }
  }
}

export const resizeWindow = (width, height) => {
  return { type: actionTypes.WINDOW_RESIZE, width, height }
}
