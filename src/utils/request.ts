import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
  type CancelTokenSource,
} from 'axios'
import Cookies from 'js-cookie'
// 定义API响应数据结构
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  [key: string]: any
}
interface ApiRequestConfig extends AxiosRequestConfig {
  _retry?: boolean
}

class Request {
  // Axios实例
  private instance: AxiosInstance

  // 是否正在刷新token
  private isRefreshing = false

  // 存储需要重试的请求队列
  private pendingRequests: Array<(token: string) => void> = []

  /**
   * 构造函数，用于创建API请求实例
   * @param baseURL API的基础URL，默认从环境变量VITE_API_BASE_URL获取，若未设置则默认为'/api'
   */
  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || '') {
    // 创建Axios实例，配置基础URL、超时时间和请求头
    this.instance = axios.create({
      baseURL, // 设置API请求的基础URL
      timeout: 10000, // 默认超时时间10秒
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
    // 初始化拦截器
    this.initInterceptors()
  }

  private removeCookies() {
    Cookies.remove('refreshToken')
    Cookies.remove('accessToken')
  }

  private async refreshToken() {
    const refreshToken = Cookies.get('refreshToken')
    if (!refreshToken) {
      this.removeCookies()
      window.location.href = '/login'
      return Promise.reject('refreshToken不存在')
    }
    try {
      const response = await axios.post(
        '/api/auth/refresh',
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
        },
      )
      const tokens = response.data.data
      if (response.data.code === 0) {
        Cookies.set('accessToken', tokens)
        return tokens
      } else {
        this.removeCookies()
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 初始化拦截器
  private initInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const accessToken = Cookies.get('accessToken')
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { data } = response

        // 处理业务错误
        if (data.code !== 0) {
          return Promise.reject(data)
        }
        return data
      },
      async (error: AxiosError) => {
        const errorConfig = error.config as ApiRequestConfig
        if (error.response?.status !== 401) {
          return Promise.reject(error)
        }
        if (error.response?.status === 401 && errorConfig._retry) {
          console.log('登录过期')
          window.location.href = '/login'
          return
        }
        if (error.response?.status === 401 && !errorConfig._retry) {
          errorConfig._retry = true
        }
        if (!this.isRefreshing) {
          this.isRefreshing = true
          try {
            const newToken = await this.refreshToken()
            this.pendingRequests.forEach((callback) => callback(newToken))
            this.pendingRequests = []
            return this.instance(errorConfig)
          } catch (error) {
            this.pendingRequests = []
            return Promise.reject(error)
          } finally {
            this.isRefreshing = false
          }
        } else {
          return new Promise((resolve) => {
            this.pendingRequests.push((token: string) => {
              if (errorConfig.headers) {
                errorConfig.headers.Authorization = `Bearer ${token}`
              }
              resolve(this.instance(errorConfig))
            })
          })
        }
      },
    )
  }

  // 生成请求唯一标识
  private getRequestKey(config: AxiosRequestConfig): string {
    const { method, url, params, data } = config
    return [
      method?.toUpperCase(),
      url,
      params ? JSON.stringify(params) : '',
      data ? JSON.stringify(data) : '',
    ].join('&')
  }

  // 错误提示

  // 取消所有请求

  // 封装请求方法
  public request<T = any>(config): Promise<T> {
    return this.instance.request<T, T>(config)
  }

  // GET请求
  public get<T = any>(url: string, params?: any): Promise<T> {
    return this.request<T>({
      url,
      method: 'get',
      params,
    })
  }

  // POST请求
  public post<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      url,
      method: 'post',
      data,
    })
  }

  // PUT请求
  public put<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      url,
      method: 'put',
      data,
    })
  }

  // DELETE请求
  public delete<T = any>(url: string, params?: any): Promise<T> {
    return this.request<T>({
      url,
      method: 'delete',
      params,
    })
  }
}

// 创建请求实例
export const request = new Request()

// 导出类型
export type { ApiResponse }
