import Service from '@/api/login'
import type { LoginParams } from '@/types/login.d'
// 定义状态类型
export interface CounterState {
  //
}

// 定义 getters 类型
interface CounterGetters {
  doubleCount: (state: CounterState) => number
  doubleCountPlusOne: () => number
}

// 定义 actions 类型
interface CounterActions {
  login: (params: LoginParams) => void
}

export default {
  // 状态
  state: (): CounterState => ({
    //
  }),

  // 计算属性
  getters: {} as CounterGetters,

  // 方法
  actions: {
    async login(params) {
      const data = await Service.login(params)
      console.log(data)
    },
  } as CounterActions,

  // 持久化配置（可选）
  persist: {
    key: 'counter-storage',
    paths: ['count'], // 只持久化 count 字段
  },
}
