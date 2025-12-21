import { LocalScope } from "./scope.js"
import { walk } from "./utils/walker.js"
import { handlers } from "./utils/directives.js"

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
    
    const cleanup = walk(el, state, handlers)
    if(typeof cleanup === "function") {
      cleanups.push(cleanup)
    }
    
    // legacy code
    // directives.forEach(mountFn => {
    //   try {
    //     const cleanup = mountFn(el, state)
    //     if(typeof cleanup === "function") {
    //       cleanups.push(cleanup)
    //     }
    //   } catch (err) {
    //     console.error(`[Directive error] ${mountFn.name}`, err, el)
    //   }
    // })
    
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