import { effect } from "../reactivity.js"
import { getNested } from "../utils.js"

export function mountIf(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-if]").forEach(ifEl => {
    const ifVal = ifEl.dataset.if
    if(!ifVal) return
    
    const parent = ifEl.parentNode
    const nextSibling = ifEl.nextSibling
    
    const ifDispose = effect(() => {
      const path = getNested(scope, ifVal)
      const read = typeof path === "function" ? path() : path
      if(read) {
        if(!ifEl.isConnected) {
          parent.insertBefore(ifEl, nextSibling)
        }
      } else {
        if(ifEl.isConnected) {
          parent.removeChild(ifEl)
        }
      }
    })
    
    disposers.push(ifDispose)
  })
  
  return () => disposers.forEach(fn => fn())
}