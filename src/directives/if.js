import { effect } from "../reactivity.js"
import { getNested } from "../utils.js"

export function mountIf(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-if]").forEach(ifEl => {
    const ifVal = ifEl.dataset.if
    
    const ifDispose = effect(() => {
      const path = getNested(scope, ifVal)
      if(path()) {
        ifEl.style.display = ""
      } else {
        ifEl.style.display = "none"
      }
    })
    
    disposers.push(ifDispose)
  })
  
  return () => disposers.forEach(fn => fn())
}