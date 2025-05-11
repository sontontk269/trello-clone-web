import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constant'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { mapOrder } from '~/utils/sort'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatter'
//khoi toa gtri State ban dau  cua  1 cai slice trong redux
const initialState = { currentActiveBoard: null }

export const fetchBoardDetailsAPI = createAsyncThunk('activeBoard/fetchBoardDetailsAPI', async (boardId) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
  //axios trả về kqua qua propertiy của nó là data
  return response.data
})

//khoi tao 1 slice trong redux
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  //reducer la noi xu li du lieu dong bo
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      const board = action.payload
      //xu li du lieu neu can thhiet

      //cap nhat lai state currentActiveBoard
      state.currentActiveBoard = board
    },
    updateCard: (state, action) => {
      //update nested data

      const incomingCard = action.payload
      // tim tu board>column> card

      const column = state.currentActiveBoard.columns.find((i) => i._id === incomingCard.columnId)

      if (column) {
        const card = column.cards.find((i) => i._id === incomingCard._id)
        if (card) {
          // card.title = incomingCard.title
          Object.keys(incomingCard).forEach((key) => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },
  //extraReducers la noi xu li du lieu bat dong bo
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      let board = action.payload //lay du lieu tu action tra ve tu response cua axios

      //members trong bỏard là gộp 2 mảng owners và members

      board.FE_allUsers = board.owners.concat(board.members)

      //sắp xếp các column ở đây luôn trước khi đẩy xuống bên dưới

      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      state.currentActiveBoard = board //cap nhat lai state currentActiveBoard
    })
  }
})

// Actionslà nơi dành cho các component bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer(chạy đồng bộ)
export const { updateCurrentActiveBoard, updateCard } = activeBoardSlice.actions

//selectors là nơi dành cho các component bên dưới gọi bằng useSelector() để lấy dữ liệu từ store ra sử dụng

export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer
