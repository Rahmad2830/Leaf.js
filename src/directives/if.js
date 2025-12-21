import { effect } from "../reactivity.js"
import { getNested } from "../utils/helpers.js"

export function mountIf(el, scope) {
  const ifVal = el.dataset.if
    if(!ifVal) return
    
    const parent = el.parentNode
    const anchor = document.createComment("if")
    parent.insertBefore(anchor, el)
    parent.removeChild(el)
    
    const ifDispose = effect(() => {
      const path = getNested(scope, ifVal)
      const read = typeof path === "function" ? path() : path
      if(read) {
        if(!el.isConnected) {
          parent.insertBefore(el, anchor)
        }
      } else {
        if(el.isConnected) {
          parent.removeChild(el)
        }
      }
    })
  
  //legacy code
  // el.querySelectorAll("[data-if]").forEach(ifEl => {
    
  // })
  
  return () => {
    ifDispose()
    if(anchor.isConnected) anchor.remove()
  }
}