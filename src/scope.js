export const LocalScope = {}
export const GlobalStore = {}

export function defineScope(name, setup) {
  LocalScope[name] = setup({ $stores: GlobalStore })
}

export function defineStore(name, setup) {
  if(!GlobalStore[name]) {
    GlobalStore[name] = setup()
  }
  return GlobalStore[name]
}