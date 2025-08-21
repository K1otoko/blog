import { createPinia, defineStore, StoreDefinition, Store } from 'pinia'
import { toRaw, Ref } from 'vue'

// 创建 Pinia 实例
const pinia = createPinia()

// 持久化配置类型
interface PersistOptions {
  key?: string
  paths?: string[]
}

// 基础 Store 配置类型
interface BaseStoreOptions<S, G, A> {
  state: () => S
  getters?: G
  actions?: A
  persist?: boolean | PersistOptions
}

// 持久化插件
const persistencePlugin = <S>(options: PersistOptions = {}) => {
  return (store: Store<string, S>) => {
    const { key = store.$id, paths } = options

    // 从本地存储加载数据
    const loadData = () => {
      const data = localStorage.getItem(key)
      if (data) {
        try {
          const parsed = JSON.parse(data) as Partial<S>
          store.$patch(parsed)
        } catch (e) {
          console.error('Failed to parse stored data', e)
        }
      }
    }

    // 初始化加载
    loadData()

    // 监听状态变化并保存
    store.$subscribe((_mutation, state) => {
      let saveData = toRaw(state)
      // 如果指定了路径，只保存指定字段
      if (paths && paths.length) {
        saveData = paths.reduce((obj, path) => {
          const value = (saveData as Record<string, unknown>)[path]
          if (value !== undefined) {
            ;(obj as Record<string, unknown>)[path] = value
          }
          return obj
        }, {} as Partial<S>)
      }
      localStorage.setItem(key, JSON.stringify(saveData))
    })
  }
}

// 基础 Store 类
export class BaseStore<
  S extends object,
  G extends Record<string, (...args: any[]) => any> = {},
  A extends Record<string, (...args: any[]) => any> = {},
> {
  private id: string
  private options: BaseStoreOptions<S, G, A>
  private store: Store<
    string,
    S,
    G,
    A & { resetState: () => void; updateState: (data: Partial<S>) => void }
  > | null = null

  constructor(id: string, options: BaseStoreOptions<S, G, A>) {
    this.id = id
    this.options = options
  }

  // 定义 Store
  define(): Store<
    string,
    S,
    G,
    A & { resetState: () => void; updateState: (data: Partial<S>) => void }
  > {
    const { state, getters, actions, persist = false } = this.options
    const plugins: any[] = []

    // 如果需要持久化，添加持久化插件
    if (persist) {
      const persistOptions = persist === true ? {} : persist
      plugins.push(persistencePlugin<S>(persistOptions))
    }

    // 添加开发环境日志插件
    if (import.meta.env.DEV) {
      plugins.push((store: Store<string, S>) => {
        store.$subscribe((mutation, state) => {
          console.log(`[Pinia] ${this.id} 状态变化:`, {
            mutation,
            state: toRaw(state),
          })
        })
      })
    }

    // 创建 Store
    const storeDefinition: StoreDefinition<
      string,
      S,
      G & { getState: () => S },
      A & { resetState: () => void; updateState: (data: Partial<S>) => void }
    > = defineStore(this.id, {
      state,
      getters: {
        ...getters,
        // 通用 getter：获取整个状态
        getState(): S {
          return toRaw(this.$state)
        },
      },
      actions: {
        ...actions,
        // 通用 action：重置状态
        resetState() {
          this.$reset()
        },
        // 通用 action：批量更新
        updateState(data: Partial<S>) {
          this.$patch(data)
        },
      },
      plugins,
    })

    this.store = storeDefinition()
    return this.store
  }

  // 获取 Store 实例
  getInstance(): Store<
    string,
    S,
    G,
    A & { resetState: () => void; updateState: (data: Partial<S>) => void }
  > {
    if (!this.store) {
      return this.define()
    }
    return this.store
  }
}

// 自动注册所有 Store
const modules = import.meta.glob('./modules/*.ts', { eager: true })
type StoreExports = Record<string, () => Store<any, any, any, any>>

const stores: StoreExports = {}

Object.keys(modules).forEach((path) => {
  const module = modules[path] as { default: BaseStoreOptions<any, any, any> }
  const match = path.match(/\.\/modules\/(.*)\.ts/)

  if (match && module.default) {
    const moduleName = match[1]
    const storeKey =
      `use${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Store` as keyof StoreExports
    const storeInstance = new BaseStore(moduleName, module.default)

    stores[storeKey] = () => {
      return storeInstance.getInstance()
    }
  }
})

export default pinia
export const { useCounterStore, useUserStore } = stores // 根据实际模块名导出
