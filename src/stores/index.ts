import { createPinia, defineStore, type Store, type StoreDefinition } from 'pinia'
import { toRaw } from 'vue'
import type { ThisType } from 'typescript'

// 创建Pinia实例
export const pinia = createPinia()

// 持久化配置类型
export interface PersistConfig {
  key?: string
  paths?: string[]
  storage?: Storage
}

// 基础Store选项类型
export interface BaseStoreOptions<State extends object, Getters = {}, Actions = {}> {
  state: () => State
  getters?: Getters
  actions?: Actions
  persist?: boolean | PersistConfig
}

// 扩展的Getters类型
type ExtendedGetters<Getters, State> = Getters & {
  getRawState: () => State
}

type BaseActions<State, Getters, Actions> = Actions & {
  resetState: () => void
  updateState: (partial: Partial<State> | ((state: State) => void)) => void
}
type ExtendedActions<State, Getters, Actions> = BaseActions<State, Getters, Actions> &
  ThisType<State & ExtendedGetters<Getters, State> & BaseActions<State, Getters, Actions>>
// 关键修复：正确声明泛型参数的ExtendedActions
// type ExtendedActions<State, Getters, Actions> = Actions & {
//   resetState: () => void
//   updateState: (partial: Partial<State> | ((state: State) => void)) => void
// } & ThisType<State & ExtendedGetters<Getters, State> & ExtendedActions<State, Getters, Actions>>

// 工具函数：处理嵌套属性
function getNestedProp(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

function setNestedProp(obj: Record<string, any>, path: string, value: any): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((acc, key) => (acc[key] ??= {}), obj)
  target[lastKey] = value
}

// 持久化插件
function createPersistPlugin<State extends object>(config: PersistConfig = {}) {
  return (store: Store<string, State>) => {
    const { key = store.$id, paths, storage = localStorage } = config

    const loadFromStorage = () => {
      const stored = storage.getItem(key)
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Record<string, any>
          const stateToPatch: Partial<State> = {}
          paths?.length
            ? paths.forEach((path) =>
                setNestedProp(
                  stateToPatch as Record<string, any>,
                  path,
                  getNestedProp(parsed, path),
                ),
              )
            : Object.assign(stateToPatch, parsed)
          store.$patch(stateToPatch)
        } catch (e) {
          console.error(`[Pinia Persist] 加载失败:`, e)
        }
      }
    }

    const saveToStorage = () => {
      const rawState = toRaw(store.$state)
      const dataToSave: Record<string, any> = {}
      paths?.length
        ? paths.forEach((path) =>
            setNestedProp(dataToSave, path, getNestedProp(rawState as Record<string, any>, path)),
          )
        : Object.assign(dataToSave, rawState)
      storage.setItem(key, JSON.stringify(dataToSave))
    }

    loadFromStorage()
    store.$subscribe(saveToStorage)
  }
}

// 基础Store类
export class BaseStore<State extends object, Getters = {}, Actions = {}> {
  private readonly id: string
  private readonly options: BaseStoreOptions<State, Getters, Actions>
  private instance: Store<
    string,
    State,
    ExtendedGetters<Getters, State>,
    ExtendedActions<State, Getters, Actions>
  > | null = null

  constructor(id: string, options: BaseStoreOptions<State, Getters, Actions>) {
    this.id = id
    this.options = options
  }

  private createDefinition(): StoreDefinition<
    string,
    State,
    ExtendedGetters<Getters, State>,
    ExtendedActions<State, Getters, Actions>
  > {
    const { state, getters, actions, persist = false } = this.options
    const plugins: any[] = []

    if (persist) {
      plugins.push(createPersistPlugin<State>(persist === true ? {} : persist))
    }

    if (import.meta.env.DEV) {
      plugins.push((store: Store<string, State>) => {
        store.$subscribe((mutation, state) => {
          console.log(`[Pinia] ${this.id} 变更:`, { mutation, state: toRaw(state) })
        })
      })
    }

    return defineStore(this.id, {
      state,
      getters: {
        ...getters,
        getRawState() {
          return toRaw(this.$state)
        },
      } as ExtendedGetters<Getters, State>,
      actions: {
        ...actions,
        resetState() {
          this.$reset()
        },
        updateState(partial) {
          this.$patch(partial)
        },
      } as ExtendedActions<State, Getters, Actions>,
      plugins,
    })
  }

  getInstance(): Store<
    string,
    State,
    ExtendedGetters<Getters, State>,
    ExtendedActions<State, Getters, Actions>
  > {
    if (!this.instance) {
      this.instance = this.createDefinition()(pinia)
    }
    return this.instance
  }
}

// 自动注册模块
const modules = import.meta.glob<{ default: BaseStoreOptions<any, any, any> }>('./modules/*.ts', {
  eager: true,
})
type Stores = Record<string, () => Store<any, any, any, any>>
const stores: Stores = {}

for (const [path, module] of Object.entries(modules)) {
  const match = path.match(/\.\/modules\/(.*)\.ts/)
  if (match && module.default) {
    const moduleName = match[1]
    const storeKey =
      `use${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Store` as keyof Stores
    stores[storeKey] = () => new BaseStore(moduleName, module.default).getInstance()
  }
}

export const { useUserStore, useLoginStore } = stores
