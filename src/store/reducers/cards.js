import { clamp } from '../../lib/util'
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
  pickedCardRotation: { x: 0, y: 0 },
  pickedCardWidth: 120,
  fakeCardIndex: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DRAW_CARD: return drawRandomCard(state)
    case actionTypes.FOCUS_CARD: return updateObject(state, { focusedCard: action.card })
    case actionTypes.PICK_CARD: return pickCard(state)
    case actionTypes.UNPICK_CARD: return unpickCard(state)
    case actionTypes.MOVE_CARD: return moveCard(state, action)
    case actionTypes.RESET_ROTATION: return updateObject(state, { pickedCardRotation: { x: 0, y: 0 } })
    case actionTypes.MOVE_FAKE_CARD: return updateObject(state, { fakeCardIndex: action.index })
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
  const x = action.x - state.pickedCardWidth / 2
  const y = action.y - state.pickedCardWidth * state.cardRatio / 2
  const diffX = state.pickedCardPosition ? x - state.pickedCardPosition.x : 0
  const diffY = state.pickedCardPosition ? y - state.pickedCardPosition.y : 0
  return updateObject(state, {
    pickedCardPosition: { x, y },
    pickedCardRotation: {
      x: clamp(-diffY * 1.5, -30, 30),
      y: clamp(diffX * 1.5, -30, 30)
    }
  })
}

function unpickCard (state) {
  return updateObject(state, {
    pickedCard: null,
    pickedCardPosition: null,
    pickedCardRotation: { x: 0, y: 0 },
    fakeCardIndex: null
  })
}

function putCard (state) {
  if (state.board.length === 5) return unpickCard(state)
  return updateObject(state, {
    board: [...state.board.slice(0, state.fakeCardIndex), state.pickedCard, ...state.board.slice(state.fakeCardIndex)],
    hand: state.hand.filter(card => card.key !== state.pickedCard.key),
    pickedCard: null,
    pickedCardPosition: null,
    pickedCardRotation: { x: 0, y: 0 },
    fakeCardIndex: null
  })
}

export default reducer
