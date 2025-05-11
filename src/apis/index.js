import { toast } from 'react-toastify'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constant'

// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
//   //axios trả về kqua qua propertiy của nó là data
//   return response.data
// }
/** Board */
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  //axios trả về kqua qua propertiy của nó là data
  return response.data
}

export const moveCardToDifferentAPI = async (updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_cards`, updateData)
  //axios trả về kqua qua propertiy của nó là data
  return response.data
}

/** Column */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  //axios trả về kqua qua propertiy của nó là data
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  //axios trả về kqua qua propertiy của nó là data
  return response.data
}
/** Card */
export const createNewCartAPI = async (newCardData) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}

export const updateCardAPI = async (cardId, cardData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}`, cardData)
  return response.data
}

/** User */

export const registerUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Account created successfully! Please check email and verify your account before logging in!!', {
    theme: 'colored'
  })

  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully!', { theme: 'colored' })
  return response.data
}

export const refreshTokenAPI = async (data) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/users/refresh-token`, data)
  return response.data
}

export const fetchBoardsAPI = async (searchpath) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards${searchpath}`)
  return response.data
}

export const createNewBoardAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/boards`, data)
  toast.success(`Create Board '${data.title}' successfully!`, { theme: 'colored' })
  return response.data
}

export const inviteUserToBoardAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/invitations/board`, data)
  toast.success('Invite user successfully!')
  return response.data
}
