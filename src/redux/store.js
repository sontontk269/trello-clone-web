//redux : state management tool

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'

import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { activeCardReducer } from './activeCard/activeCardSlice'
import { notificationsReducer } from './notifications/notificationsSlice'

const persistConfig = {
  key: 'root',
  storage: storage,
  whiteList: ['user']
}

const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer
})

const persistedReducers = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  //fix warning persist
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
