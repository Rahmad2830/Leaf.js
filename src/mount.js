import { LocalScope } from "./scope.js"
import { mountText } from "./directives/text.js"
import { mountOn } from "./directives/on.js"
import { mountIf } from "./directives/if.js"
import { mountFor } from "./directives/for.js"
import { mountModel } from "./directives/model.js"
import { mountInit } from "./directives/init.js"
import { mountBind } from "./directives/bind.js"

const directives = [
  mountText,
  mountOn,
  mountIf,
  mountFor,
  mountModel,
  mountInit,
  mountBind
]

const cleanupMap = new WeakMap()

export function mount() {
  document.querySelectorAll("[data-scope]").forEach(el => {
    const state = LocalScope[el.dataset.scope]
    if(!state) {
      throw new Error(`Scope ${el.dataset.scope} is not defined`)
    }
    
    const prevCleanup = cleanupMap.get(el)
    if(prevCleanup) {
      prevCleanup.forEach(fn => fn())
    }
    
    const cleanups = []
    
    directives.forEach(mountFn => {
      try {
        const cleanup = mountFn(el, state)
        if(typeof cleanup === "function") {
          cleanups.push(cleanup)
        }
      } catch (err) {
        console.error(`[Directive error] ${mountFn.name}`, err, el)
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