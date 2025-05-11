import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constant'

const initialState = { currentNotification: null }

export const fetchInvitationsAPI = createAsyncThunk('notifications/fetchInvitationsAPI', async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/invitations`)

  return response.data
})

export const updateBoardInvitationsAPI = createAsyncThunk(
  'notification/updateBoardInvitationsAPI',
  async ({ status, invitationId }) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, { status })
    return response.data
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotification = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotification = action.payload
    },
    addNotification: (state, action) => {
      //them vao dau mang (unshift)
      state.currentNotification.unshift(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      let invitations = action.payload
      state.currentNotification = Array.isArray(invitations) ? invitations.reverse() : []
    })
    builder.addCase(updateBoardInvitationsAPI.fulfilled, (state, action) => {
      const invitation = action.payload

      const getInvitation = state.currentNotification.find((i) => i._id === invitation._id)
      getInvitation.boardInvitation = invitation.boardInvitation
    })
  }
})

export const { clearCurrentNotifications, updateCurrentNotifications, addNotification } = notificationsSlice.actions

export const selectCurrentNotification = (state) => {
  return state.notifications.currentNotification
}

export const notificationsReducer = notificationsSlice.reducer
