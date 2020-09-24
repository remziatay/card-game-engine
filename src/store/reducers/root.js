import { combineReducers } from 'redux'
import cardsReducer from './cards'

const rootReducer = combineReducers({
  cards: cardsReducer
})

export default rootReducer
