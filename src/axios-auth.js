import axios from "axios";

const axiosAuth = axios.create()

axiosAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    const user_id = localStorage.getItem("user_id")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      config.params = config.params || {};
      config.params.user_id = user_id
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
export default axiosAuth