import { clamp } from '../../lib/util'
import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../utility'

const initialDeck = Array(30).fill().map((_, i) => ({
  key: `p${i}`,
  title: `${i}. card`,
  background: `rgb(${[0, 0, 0].map(_ => Math.random() * 256 | 0)})`,
  mana: Math.floor(1 + Math.random() * 8),
  attack: Math.floor(1 + Math.random() * 7),
  health: Math.floor(1 + Math.random() * 8)
}))

const initialOpponentBoard = Array(9).fill().map((_, i) => ({
  key: `op${i}`,
  background: `rgb(${[0, 0, 0].map(_ => Math.random() * 256 | 0)})`,
  attack: Math.floor(1 + Math.random() * 7),
  health: Math.floor(1 + Math.random() * 8)
})).map(p => ({ ...p, realHealth: p.health }))

const originalRotation = { x: 15, y: 0 }

const cardRatio = 1.5
const windowCardRatio = 0.20
const cardWidth = window.innerHeight * windowCardRatio / cardRatio
const pickedRatio = 1.2

function getCardSizes () {
  const refHeigt = window.innerHeight / 626
  const handSize = 0.3 * refHeigt + 'em'
  const focusSize = 1 * refHeigt + 'em'
  const pickSize = 0.4 * refHeigt + 'em'
  return { handSize, focusSize, pickSize }
}

const { handSize, focusSize, pickSize } = getCardSizes()

const initialState = {
  turn: true,
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
  arrow: null, // { from: null, to: null }
  pawnPositions: [],
  opponentPositions: [],
  handSize,
  focusSize,
  pickSize
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.END_TURN: return endTurn(state)
    case actionTypes.DRAW_CARD: return drawRandomCard(state)
    case actionTypes.FOCUS_CARD: return updateObject(state, { focusedCard: action.card })
    case actionTypes.PICK_CARD: return pickCard(state)
    case actionTypes.UNPICK_CARD: return unpickCard(state)
    case actionTypes.MOVE_CARD: return moveCard(state, action)
    case actionTypes.RESET_ROTATION: return updateObject(state, { pickedCardRotation: originalRotation })
    case actionTypes.MOVE_FAKE_CARD: return updateObject(state, { fakeCardIndex: action.index })
    case actionTypes.PUT_CARD: return putCard(state)
    case actionTypes.SET_DECK_POSITION: return updateObject(state, { deckPosition: action.position })
    case actionTypes.PICK_PAWN: return pickPawn(state, action.pawnKey)
    case actionTypes.FOCUS_PAWN: return focusPawn(state, action.pawnKey)
    case actionTypes.REMOVE_PAWN: return removePawn(state, action.pawnKey)
    case actionTypes.ATTACK_START: return attackStart(state, action.pawnKey, action.opponentKey)
    case actionTypes.ATTACK_CANCEL: return attackCancel(state)
    case actionTypes.ATTACK: return attack(state, action.pawnKey, action.opponentKey)
    case actionTypes.ATTACKS_END: return attacksEnd(state)
    case actionTypes.SET_PAWN_POSITIONS: return setPawnPositions(state, action.pawnPositions, action.opponentPositions)
    case actionTypes.WINDOW_RESIZE: return windowResize(state, action.width, action.height)
    default: return state
  }
}

function windowResize (state, width, height) {
  const { handSize, focusSize, pickSize } = getCardSizes()
  return updateObject(state, { handSize, focusSize, pickSize })
}

function endTurn (state) {
  const draw = state.turn ? {} : randomCard(state.deck, state.hand)

  return updateObject(state, {
    turn: !state.turn,
    pickedCard: null,
    pickedCardPosition: null,
    pickedCardRotation: originalRotation,
    fakeCardIndex: null,
    pickedPawn: null,
    focusedPawn: null,
    board: state.board.map(pawn => updateObject(pawn, { sleeping: false })),
    ...draw
  })
}

function randomCard (deck, hand) {
  if (hand.length === 9 || deck.length === 0) return {}
  const random = Math.floor(Math.random() * deck.length)
  const randomCard = deck[random]
  return {
    deck: [...deck.slice(0, random), ...deck.slice(random + 1)],
    hand: hand.concat(randomCard)
  }
}

function drawRandomCard (state) {
  return updateObject(state, { ...randomCard(state.deck, state.hand) })
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
  const pawn = updateObject(state.pickedCard, { sleeping: true, realHealth: state.pickedCard.health })
  return updateObject(state, {
    board: [...state.board.slice(0, state.fakeCardIndex), pawn, ...state.board.slice(state.fakeCardIndex)],
    hand: state.hand.filter(card => card.key !== state.pickedCard.key),
    pickedCard: null,
    pickedCardPosition: null,
    pickedCardRotation: originalRotation,
    fakeCardIndex: null
  })
}

export function canAttack (state, pawnKey, opponentKey) {
  const pawn = state.board.find(p => p.key === pawnKey)
  const opponent = state.opponentBoard.find(p => p.key === opponentKey)
  if (opponent.realHealth <= 0) return false
  if (pawn.sleeping) return false
  return true
}

function pickPawn (state, pawnKey) {
  if (pawnKey === null) { return updateObject(state, { pickedPawn: null, arrow: null }) }
  const pawnIndex = state.board.findIndex(p => p.key === pawnKey)
  return updateObject(state, {
    pickedPawn: state.board[pawnIndex],
    arrow: { from: state.pawnPositions[pawnIndex], to: null }
  })
}

function focusPawn (state, pawnKey) {
  if (pawnKey === null) {
    return updateObject(state, {
      focusedPawn: null,
      pickedPawn: updateObject(state.pickedPawn, { dies: false }),
      arrow: updateObject(state.arrow, { to: null })
    })
  }
  const pawnIndex = state.opponentBoard.findIndex(p => p.key === pawnKey)
  const pawn = state.opponentBoard[pawnIndex]
  if (!canAttack(state, state.pickedPawn.key, pawn.key)) return state

  return updateObject(state, {
    focusedPawn: updateObject(pawn, { dies: pawn.realHealth - state.pickedPawn.attack <= 0 }),
    pickedPawn: updateObject(state.pickedPawn, { dies: state.pickedPawn.realHealth - pawn.attack <= 0 }),
    arrow: updateObject(state.arrow, { to: state.opponentPositions[pawnIndex] })
  })
}

function removePawn (state, pawnKey) {
  return updateObject(state, {
    board: state.board.filter(pawn => pawn.key !== pawnKey),
    opponentBoard: state.opponentBoard.filter(pawn => pawn.key !== pawnKey)
  })
}

function setPawnPositions (state, pawnPositions, opponentPositions) {
  let arrow = state.arrow

  let pawnIndex = state.board.findIndex(p => p.key === state.pickedPawn?.key)
  if (pawnIndex >= 0) arrow = updateObject(arrow, { from: pawnPositions[pawnIndex] })

  pawnIndex = state.opponentBoard.findIndex(p => p.key === state.focusedPawn?.key)
  if (pawnIndex >= 0)arrow = updateObject(arrow, { to: opponentPositions[pawnIndex] })

  return updateObject(state, { pawnPositions, opponentPositions, arrow })
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
    opponentBoard: state.opponentBoard.map(op => op.key === opponent.key ? newOpponent : op),
    arrow: null
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
    board: state.board.map(pawn => pawn.health > 0 ? pawn : updateObject(pawn, { dead: true })),
    opponentBoard: state.opponentBoard.map(pawn => pawn.health > 0 ? pawn : updateObject(pawn, { dead: true }))
  })
}

export default reducer
