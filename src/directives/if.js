import { effect } from "../reactivity.js"
import { getNested } from "../utils.js"

export function mountIf(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-if]").forEach(ifEl => {
    const ifVal = ifEl.dataset.if
    if(!ifVal) return
    
    const ifDispose = effect(() => {
      const path = getNested(scope, ifVal)
      const read = typeof path === "function" ? path() : path
      if(read) {
        ifEl.style.display = ""
      } else {
        ifEl.style.display = "none"
      }
    })
    
    disposers.push(ifDispose)
  })
  
  return () => disposers.forEach(fn => fn())
}