import * as actionTypes from './actionTypes'

export const drawCard = () => {
  return { type: actionTypes.DRAW_CARD }
}

export const pickCard = (key) => {
  return { type: actionTypes.PICK_CARD, key }
}

export const putCard = () => {
  return { type: actionTypes.PUT_CARD }
}
