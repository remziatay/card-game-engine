import { clamp } from '../../lib/util'
import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../utility'

const initialDeck = Array(30).fill().map((_, i) => ({
  key: i,
  title: `${i}. card`,
  background: `rgb(${[0, 0, 0].map(_ => Math.random() * 256 | 0)})`,
  mana: Math.floor(1 + Math.random() * 8),
  attack: Math.floor(1 + Math.random() * 7),
  health: Math.floor(1 + Math.random() * 8)
}))

const initialOpponentBoard = Array(9).fill().map((_, i) => ({
  key: i,
  background: `rgb(${[0, 0, 0].map(_ => Math.random() * 256 | 0)})`,
  attack: Math.floor(1 + Math.random() * 7),
  health: Math.floor(1 + Math.random() * 8)
})).map(p => ({ ...p, realHealth: p.health }))

const originalRotation = { x: 15, y: 0 }

const cardRatio = 1.5
const windowCardRatio = 0.20
const cardWidth = window.innerHeight * windowCardRatio / cardRatio
const pickedRatio = 1.2

const initialState = {
  deck: initialDeck,
  hand: [],
  board: [],
  opponentBoard: initialOpponentBoard,
  cardGrid: 6,
  cardWidth,
  cardRatio,
  focusedCard: null,
  pickedCard: null,
  pickedCardPosition: null,
  pickedCardRotation: originalRotation,
  pickedRatio,
  pickedCardWidth: cardWidth * pickedRatio,
  fakeCardIndex: null,
  cardShadowColor: 'white',
  deckPosition: { x: 0, y: 0 },
  pickedPawn: null,
  focusedPawn: null,
  animation: null,
  handSize: '.3em',
  focusSize: '1em',
  pickSize: '.4em'
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DRAW_CARD: return drawRandomCard(state)
    case actionTypes.FOCUS_CARD: return updateObject(state, { focusedCard: action.card })
    case actionTypes.PICK_CARD: return pickCard(state)
    case actionTypes.UNPICK_CARD: return unpickCard(state)
    case actionTypes.MOVE_CARD: return moveCard(state, action)
    case actionTypes.RESET_ROTATION: return updateObject(state, { pickedCardRotation: originalRotation })
    case actionTypes.MOVE_FAKE_CARD: return updateObject(state, { fakeCardIndex: action.index })
    case actionTypes.PUT_CARD: return putCard(state)
    case actionTypes.SET_DECK_POSITION: return updateObject(state, { deckPosition: action.position })
    case actionTypes.PICK_PAWN: return updateObject(state, { pickedPawn: action.pawn })
    case actionTypes.FOCUS_PAWN: return focusPawn(state, action.pawn)
    case actionTypes.ATTACK_START: return attackStart(state, action.pawnKey, action.opponentKey)
    case actionTypes.ATTACK_CANCEL: return attackCancel(state)
    case actionTypes.ATTACK: return attack(state, action.pawnKey, action.opponentKey)
    case actionTypes.ATTACKS_END: return attacksEnd(state)
    case actionTypes.WINDOW_RESIZE: return windowResize(state, action.width, action.height)
    default: return state
  }
}

function windowResize (state, width, height) {
  const cardWidth = height * windowCardRatio / state.cardRatio
  return updateObject(state, {
    cardWidth,
    pickedCardWidth: cardWidth * state.pickedRatio
  })
}

function drawRandomCard (state) {
  if (state.hand.length === 9 || state.deck.length === 0) return state
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
      x: originalRotation.x + clamp(-diffY * 1.5, -30, 30),
      y: originalRotation.y + clamp(diffX * 1.5, -30, 30)
    }
  })
}

function unpickCard (state) {
  return updateObject(state, {
    pickedCard: null,
    pickedCardPosition: null,
    pickedCardRotation: originalRotation,
    fakeCardIndex: null
  })
}

function putCard (state) {
  if (state.board.length === 5) return unpickCard(state)
  const pawn = updateObject(state.pickedCard, { sleeping: false, realHealth: state.pickedCard.health })
  return updateObject(state, {
    board: [...state.board.slice(0, state.fakeCardIndex), pawn, ...state.board.slice(state.fakeCardIndex)],
    hand: state.hand.filter(card => card.key !== state.pickedCard.key),
    pickedCard: null,
    pickedCardPosition: null,
    pickedCardRotation: originalRotation,
    fakeCardIndex: null
  })
}

function focusPawn (state, pawn) {
  return updateObject(state, { focusedPawn: pawn })
}

function attackCancel (state) {
  return updateObject(state, {
    pickedPawn: null,
    focusedPawn: null
  })
}

function attackStart (state, pawnKey, opponentKey) {
  const pawn = state.board.find(p => p.key === pawnKey)
  const opponent = state.opponentBoard.find(p => p.key === opponentKey)
  const newPawn = updateObject(pawn, { sleeping: true, realHealth: pawn.realHealth - opponent.attack })
  const newOpponent = updateObject(opponent, { realHealth: opponent.realHealth - pawn.attack })
  return updateObject(state, {
    pickedPawn: null,
    focusedPawn: null,
    animation: state.pickedPawn.key + '-' + state.focusedPawn.key,
    board: state.board.map(p => p.key === pawn.key ? newPawn : p),
    opponentBoard: state.opponentBoard.map(op => op.key === opponent.key ? newOpponent : op)
  })
}

function attack (state, pawnKey, opponentKey) {
  const pawn = state.board.find(p => p.key === pawnKey)
  const opponent = state.opponentBoard.find(p => p.key === opponentKey)
  const newPawn = updateObject(pawn, { health: pawn.health - opponent.attack })
  const newOpponent = updateObject(opponent, { health: opponent.health - pawn.attack })
  return updateObject(state, {
    board: state.board.map(p => p.key === pawn.key ? newPawn : p),
    opponentBoard: state.opponentBoard.map(op => op.key === opponent.key ? newOpponent : op)
  })
}

function attacksEnd (state) {
  return updateObject(state, {
    board: state.board.filter(pawn => pawn.health > 0),
    opponentBoard: state.opponentBoard.filter(pawn => pawn.health > 0)
  })
}

export default reducer
