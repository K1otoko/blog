import axios from 'axios'
import { ElMessage } from 'element-plus'

const code = {
  400: '请求失败',
  401: '未授权',
  403: '禁止访问',
  404: '请求资源不存在',
  500: '服务器内部错误',
  501: '服务器未实现',
  502: '网关错误',
  503: '服务不可用',
} as { [key: string]: string }

const instance = axios.create({
  baseURL: '/api',
  timeout: 3000,
})

// 添加请求拦截器
instance.interceptors.request.use((config) => {
  const token: string | null = sessionStorage.getItem('token')
  if (token) {
    config.headers['token'] = token
  }
  return config
})
// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    return res
  },
  (error) => {
    if (error && error.response) {
      error.message = error.message || code[error.response.status]
      ElMessage.error(error.message)
    } else {
      error.message = error.message || '连接到服务器失败'
      ElMessage.error(error.message)
    }
    return Promise.reject(error)
  },
)
export default instance
