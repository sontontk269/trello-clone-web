import { createSlice } from '@reduxjs/toolkit'

const initialState = { currentActiveCard: null, isShowModalActiveCard: false }

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },
    updateCurrentAciveCard: (state, action) => {
      state.currentActiveCard = action.payload
    },
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    }
  },
  extraReducers: (buidler) => {}
})

export const { showModalActiveCard, clearCurrentActiveCard, updateCurrentAciveCard } = activeCardSlice.actions

export const selectCurrentCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}

export const activeCardReducer = activeCardSlice.reducer
