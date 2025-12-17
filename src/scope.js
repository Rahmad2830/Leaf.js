export const LocalScope = {}
export const GlobalStore = {}

export function defineScope(name, setup) {
  LocalScope[name] = setup()
}

export function defineStore(name, setup) {
  if(!GlobalStore[name]) {
    GlobalStore[name] = store()
  }
  return GlobalStore[name]
}