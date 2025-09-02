import Service from '@/api/user'
import type { User } from '@/types/user.d'

// 定义状态类型
export interface CounterState {
  //
  userList: User[]
}

// 定义 getters 类型
interface CounterGetters {
  doubleCount: (state: CounterState) => number
  doubleCountPlusOne: () => number
}

// 定义 actions 类型
interface CounterActions {
  getUserList: (this: CounterState) => Promise<void>
}

export default {
  // 状态
  state: (): CounterState => ({
    //
    userList: [],
  }),

  // 计算属性
  getters: {} as CounterGetters,

  // 方法
  actions: {
    async getUserList() {
      const res = await Service.getUserList()
      this.userList = res.data
    },
  } as CounterActions,

  // 持久化配置（可选）
  persist: {
    key: 'counter-storage',
    paths: ['count'], // 只持久化 count 字段
  },
}
