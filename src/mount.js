import { LocalScope } from "./scope.js"
import { mountText } from "./directives/text.js"
import { mountOn } from "./directives/on.js"
import { mountIf } from "./directives/if.js"
import { mountFor } from "./directives/for.js"
import { mountModel } from "./directives/model.js"
import { mountInit } from "./directives/init.js"

const directives = [
  mountText,
  mountOn,
  mountIf,
  mountFor,
  mountModel,
  mountInit
]

const cleanupMap = new WeakMap()

export function mount() {
  document.querySelectorAll("[data-scope]").forEach(el => {
    const state = LocalScope[el.dataset.scope]
    if(!state) return
    
    const prevCleanup = cleanupMap.get(el)
    if(prevCleanup) {
      prevCleanup.forEach(fn => fn())
    }
    
    const cleanups = []
    
    directives.forEach(mountFn => {
      const cleanup = mountFn(el, state)
      if(typeof cleanup === "function") {
        cleanups.push(cleanup)
      }
    })
    
    cleanupMap.set(el, cleanups)
  })
}

//REQUIRED FOR SPA USAGE
export function unmount(el) {
  const cleanups = cleanupMap.get(el)
  if(!cleanups) return
  
  cleanups.forEach(fn => fn())
  cleanupMap.delete(el)
}