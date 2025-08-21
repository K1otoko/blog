import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
  type CancelTokenSource,
} from 'axios'

// 定义API响应数据结构
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  [key: string]: any
}

// 定义请求配置扩展
interface RequestConfig extends AxiosRequestConfig {
  // 是否显示加载中状态
  showLoading?: boolean
  // 是否忽略错误提示
  ignoreError?: boolean
  // 是否需要Token验证
  needToken?: boolean
}

// 错误类型
enum ErrorType {
  NETWORK_ERROR = '网络错误',
  TIMEOUT_ERROR = '请求超时',
  ABORT_ERROR = '请求被取消',
  SERVER_ERROR = '服务器错误',
  UNKNOWN_ERROR = '未知错误',
}

class Request {
  // Axios实例
  private instance: AxiosInstance

  // 取消请求的Token映射
  private cancelTokenMap: Map<string, CancelTokenSource> = new Map()

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || '') {
    // 创建Axios实例
    this.instance = axios.create({
      baseURL,
      timeout: 10000, // 默认超时时间10秒
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })

    // 初始化拦截器
    this.initInterceptors()
  }

  // 初始化拦截器
  private initInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: RequestConfig) => {
        // 处理加载状态
        if (config.showLoading) {
          // 这里可以调用 Loading 组件显示加载状态
          console.log('请求加载中...')
        }

        // 添加Token
        if (config.needToken !== false) {
          const token = localStorage.getItem('token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }

        // 处理取消请求
        const requestKey = this.getRequestKey(config)
        // 如果已有相同请求，先取消
        if (this.cancelTokenMap.has(requestKey)) {
          this.cancelTokenMap.get(requestKey)?.cancel('重复请求已取消')
          this.cancelTokenMap.delete(requestKey)
        }
        const source = axios.CancelToken.source()
        config.cancelToken = source.token
        this.cancelTokenMap.set(requestKey, source)

        return config
      },
      (error: AxiosError) => {
        this.handleError(error)
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 移除取消请求Token
        const requestKey = this.getRequestKey(response.config)
        this.cancelTokenMap.delete(requestKey)

        // 关闭加载状态
        if ((response.config as RequestConfig).showLoading) {
          // 这里可以调用 Loading 组件关闭加载状态
          console.log('请求完成')
        }

        const { data } = response

        // 处理业务错误
        if (data.code !== 200) {
          // 未登录处理
          if (data.code === 401) {
            // 清除Token并跳转到登录页
            localStorage.removeItem('token')
            window.location.href = '/login'
          }

          // 非忽略错误则提示
          if (!(response.config as RequestConfig).ignoreError) {
            this.showError(data.message || '请求失败')
          }

          return Promise.reject(data)
        }

        return data.data
      },
      (error: AxiosError) => {
        // 移除取消请求Token
        if (error.config) {
          const requestKey = this.getRequestKey(error.config)
          this.cancelTokenMap.delete(requestKey)
        }

        // 关闭加载状态
        if (error.config && (error.config as RequestConfig).showLoading) {
          console.log('请求完成')
        }

        this.handleError(error)
        return Promise.reject(error)
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

  // 错误处理
  private handleError(error: AxiosError) {
    let errorMessage = ErrorType.UNKNOWN_ERROR

    if (axios.isCancel(error)) {
      errorMessage = ErrorType.ABORT_ERROR
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = ErrorType.TIMEOUT_ERROR
    } else if (!error.response) {
      errorMessage = ErrorType.NETWORK_ERROR
    } else if (error.response.status >= 500) {
      errorMessage = ErrorType.SERVER_ERROR
    } else if (error.response.data?.message) {
      errorMessage = error.response.data.message
    }

    this.showError(errorMessage)
  }

  // 错误提示
  private showError(message: string) {
    // 这里可以替换为项目中的提示组件，如 ElMessage
    console.log('请求错误:', message)
  }

  // 取消所有请求
  public cancelAllRequests() {
    this.cancelTokenMap.forEach((source) => {
      source.cancel('所有请求已取消')
    })
    this.cancelTokenMap.clear()
  }

  // 取消指定请求
  public cancelRequest(url: string, method: string = 'get') {
    this.cancelTokenMap.forEach((source, key) => {
      if (key.includes(method.toUpperCase()) && key.includes(url)) {
        source.cancel(`请求 ${url} 已取消`)
        this.cancelTokenMap.delete(key)
      }
    })
  }

  // 封装请求方法
  public request<T = any>(config: RequestConfig): Promise<T> {
    return this.instance.request<T, T>(config)
  }

  // GET请求
  public get<T = any>(
    url: string,
    params?: any,
    config?: Omit<RequestConfig, 'url' | 'method' | 'params'>,
  ): Promise<T> {
    return this.request<T>({
      url,
      method: 'get',
      params,
      ...config,
    })
  }

  // POST请求
  public post<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<T> {
    return this.request<T>({
      url,
      method: 'post',
      data,
      ...config,
    })
  }

  // PUT请求
  public put<T = any>(
    url: string,
    data?: any,
    config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
  ): Promise<T> {
    return this.request<T>({
      url,
      method: 'put',
      data,
      ...config,
    })
  }

  // DELETE请求
  public delete<T = any>(
    url: string,
    params?: any,
    config?: Omit<RequestConfig, 'url' | 'method' | 'params'>,
  ): Promise<T> {
    return this.request<T>({
      url,
      method: 'delete',
      params,
      ...config,
    })
  }
}

// 创建请求实例
export const request = new Request()

// 导出类型
export type { ApiResponse, RequestConfig }
