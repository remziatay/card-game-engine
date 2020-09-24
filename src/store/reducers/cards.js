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
  perspectiveOrigin: { x: 'center', y: 'center' },
  pickedCardWidth: 120
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DRAW_CARD: return drawRandomCard(state)
    case actionTypes.FOCUS_CARD: return updateObject(state, { focusedCard: action.card })
    case actionTypes.PICK_CARD: return pickCard(state)
    case actionTypes.UNPICK_CARD: return unpickCard(state)
    case actionTypes.MOVE_CARD: return moveCard(state, action)
    case actionTypes.RESET_ROTATION: return updateObject(state, { pickedCardRotation: { x: 0, y: 0 } })
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
  const changes = {
    pickedCardPosition: { x, y },
    pickedCardRotation: { x: -diffY * 1.5, y: diffX * 1.5 }
  }
  if (state.perspectiveOrigin.x === 'center') changes.perspectiveOrigin = { x: action.x, y: action.y }
  else {
    const diffX = state.perspectiveOrigin.x - action.x
    const diffY = state.perspectiveOrigin.y - action.y
    if (diffX ** 2 + diffY ** 2 > 100 ** 2) {
      console.log('yo')
      changes.perspectiveOrigin = { x: action.x, y: action.y }
    }
  }
  return updateObject(state, changes)
}

function unpickCard (state) {
  return updateObject(state, {
    pickedCard: null,
    pickedCardPosition: null,
    pickedCardRotation: { x: 0, y: 0 },
    perspectiveOrigin: { x: 'center', y: 'center' }
  })
}

function putCard (state) {
  if (state.board.length === 5) return unpickCard(state)
  return updateObject(state, {
    board: state.board.concat(state.pickedCard),
    hand: state.hand.filter(card => card.key !== state.pickedCard.key),
    pickedCard: null,
    pickedCardPosition: null,
    pickedCardRotation: { x: 0, y: 0 },
    perspectiveOrigin: { x: 'center', y: 'center' }
  })
}

export default reducer
