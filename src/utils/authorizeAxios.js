import axios from 'axios'
import { toast } from 'react-toastify'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { interceptorsLoadingElement } from '~/utils/formatter'

let axiosReduxStore
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore
}

let authorizeAxiosInstance = axios.create()

authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10 //10phut

authorizeAxiosInstance.defaults.withCredentials = true

authorizeAxiosInstance.interceptors.request.use(
  (config) => {
    //chan spam click
    interceptorsLoadingElement(true)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let refreshTokenPromise = null

authorizeAxiosInstance.interceptors.response.use(
  (response) => {
    //chan spam click
    interceptorsLoadingElement(false)
    return response
  },
  (error) => {
    //chan spam click
    interceptorsLoadingElement(false)

    if (error?.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }
    // 410
    const originalRequests = error.config
    if (error?.response?.status === 410 && !originalRequests._retry) {
      originalRequests._retry = true

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            return data?.accessToken
          })
          .catch(() => {
            //logout luon neu co loi
            axiosReduxStore.dispatch(logoutUserAPI(false))
          })
          .finally(() => {
            //du thanh cong hay loi thi van gan refreshTokenPromise =null nhu ban dau
            refreshTokenPromise = null
          })
      }

      return refreshTokenPromise.then((accessToken) => {
        return authorizeAxiosInstance(originalRequests)
      })
    }
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }

    if (error?.response?.status !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  }
)

export default authorizeAxiosInstance
