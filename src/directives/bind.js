import { effect } from "../reactivity.js"
import { getNested } from "../utils.js"

export function mountBind(el, state) {
  const disposers = []
  
  el.querySelectorAll("[data-bind]").forEach(bindEl => {
    const bindVal = bindEl.dataset.bind
    if(!bindVal || !bindVal.includes(":")) return
    
    const [attr, path] = bindEl.dataset.bind.split(":").map(p => p.trim())
    
    const read = getNested(state, path)
    if(typeof read !== "function") {
      throw new Error(`[bind] ${path} is not a signal`);
    }
    
    const bindDispose = effect(() => {
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