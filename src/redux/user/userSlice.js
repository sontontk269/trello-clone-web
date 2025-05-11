import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constant'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
//khoi toa gtri State ban dau  cua  1 cai slice trong redux
const initialState = { currentUser: null }

export const loginUserAPI = createAsyncThunk('user/loginUserAPI', async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
  //axios trả về kqua qua propertiy của nó là data
  return response.data
})

export const logoutUserAPI = createAsyncThunk('user/logoutUserAPI', async (showSuccessMessage = true) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
  if (showSuccessMessage) toast.success('Logged out successfully!!')
  return response.data
})

export const updateUserAPI = createAsyncThunk('user/updateUserAPI', async (data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/update-userinfo`, data)

  return response.data
})

//khoi tao 1 slice trong redux
export const userSlice = createSlice({
  name: 'user',
  initialState,
  //reducer la noi xu li du lieu dong bo
  reducers: {},
  //extraReducers la noi xu li du lieu bat dong bo
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const user = action.payload //lay du lieu tu action tra ve tu response cua axios

      state.currentUser = user
    })
    //clear userdata trong redux khi logout
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })

    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload //lay du lieu tu action tra ve tu response cua axios

      state.currentUser = user
    })
  }
})

// Actionslà nơi dành cho các component bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer(chạy đồng bộ)
// export const {} = activeUserSlice.actions

//selectors là nơi dành cho các component bên dưới gọi bằng useSelector() để lấy dữ liệu từ store ra sử dụng

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer
