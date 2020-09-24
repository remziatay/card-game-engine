import * as actionTypes from './actionTypes'

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

export const putCard = () => {
  return { type: actionTypes.PUT_CARD }
}
