import { effect } from "../reactivity.js"
import { getNested } from "../utils.js"

export function mountBind(el, state) {
  const disposers = []
  
  el.querySelectorAll("[data-bind]").forEach(bindEl => {
    
    const [attr, path] = bindEl.dataset.bind.split(":").map(p => p.trim())
    const read = getNested(state, path)
    
    const bindDispose = effect(() => {
      if(typeof read !== "function") {
        return
      }
      const val = read()
      
      if(val === null || val === undefined) {
        bindEl.removeAttribute(attr)
      } else if(val === true) {
        bindEl.setAttribute(attr, "")
      } else if(val === false) {
        bindEl.removeAttribute(attr)
      } else {
        bindEl.setAttribute(attr, val)
      }
    })
    disposers.push(bindDispose)
  })
  
  return () => disposers.forEach(fn => fn())
}