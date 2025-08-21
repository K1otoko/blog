// 定义状态类型
export interface CounterState {
  count: number
  title: string
}

// 定义 getters 类型
interface CounterGetters {
  doubleCount: (state: CounterState) => number
  doubleCountPlusOne: () => number
}

// 定义 actions 类型
interface CounterActions {
  increment: () => void
  decrement: () => void
  add: (amount: number) => void
}

export default {
  // 状态
  state: (): CounterState => ({
    count: 0,
    title: '计数器',
  }),

  // 计算属性
  getters: {
    doubleCount: (state: CounterState) => state.count * 2,
    doubleCountPlusOne(): number {
      // this 指向当前 store 的 getters 和 state
      return this.doubleCount + 1
    },
  } as CounterGetters,

  // 方法
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    add(amount: number) {
      this.count += amount
    },
  } as CounterActions,

  // 持久化配置（可选）
  persist: {
    key: 'counter-storage',
    paths: ['count'], // 只持久化 count 字段
  },
}
