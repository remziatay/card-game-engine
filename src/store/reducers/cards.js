import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../utility'

const deck = Array(30).fill().map((_, i) => ({
  key: i,
  title: `${i}. card`
}))

const initialState = {
  deck,
  hand: [],
  board: [],
  pickedCard: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DRAW_CARD: return drawRandomCard(state)
    case actionTypes.PICK_CARD: return updateObject(state, { pickedCard: action.key })
    case actionTypes.PUT_CARD: return putCard(state)
    default: return state
  }
}

function drawRandomCard (state) {
  const random = Math.floor(Math.random() * state.deck.length)
  const randomCard = deck[random]
  return updateObject(state, {
    deck: [...state.deck.slice(0, random), ...state.deck.slice(random + 1)],
    hand: state.hand.concat(randomCard)
  })
}

function putCard (state) {
  return updateObject(state, {
    board: state.board.concat(state.hand.find(card => card.key === state.pickedCard)),
    hand: state.hand.filter(card => card.key !== state.pickedCard)
  })
}

export default reducer
