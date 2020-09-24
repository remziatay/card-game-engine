import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../utility'

const initialDeck = Array(30).fill().map((_, i) => ({
  key: i,
  title: `${i}. card`
}))

const initialState = {
  deck: initialDeck,
  hand: [],
  board: [],
  cardGrid: 6,
  cardWidth: 100,
  cardRatio: 1.5,
  focusedCard: null,
  pickedCard: null,
  pickedCardPosition: null,
  pickedCardWidth: 300
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DRAW_CARD: return drawRandomCard(state)
    case actionTypes.FOCUS_CARD: return updateObject(state, { focusedCard: action.card })
    case actionTypes.PICK_CARD: return pickCard(state)
    case actionTypes.UNPICK_CARD: return unpickCard(state)
    case actionTypes.MOVE_CARD: return moveCard(state, action)
    case actionTypes.PUT_CARD: return putCard(state)
    default: return state
  }
}

function drawRandomCard (state) {
  if (state.hand.length === 9) return state
  const random = Math.floor(Math.random() * state.deck.length)
  const randomCard = state.deck[random]
  return updateObject(state, {
    deck: [...state.deck.slice(0, random), ...state.deck.slice(random + 1)],
    hand: state.hand.concat(randomCard)
  })
}

function pickCard (state) {
  return updateObject(state, {
    pickedCard: state.focusedCard,
    focusedCard: null
  })
}

function moveCard (state, action) {
  return updateObject(state, {
    pickedCardPosition: {
      x: action.x - state.pickedCardWidth / 2,
      y: action.y - state.pickedCardWidth * state.cardRatio / 2
    }
  })
}

function unpickCard (state) {
  return updateObject(state, { pickedCard: null })
}

function putCard (state) {
  if (state.board.length === 5) return unpickCard(state)
  return updateObject(state, {
    board: state.board.concat(state.pickedCard),
    hand: state.hand.filter(card => card.key !== state.pickedCard.key),
    pickedCard: null
  })
}

export default reducer
