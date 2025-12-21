import { effect } from "../reactivity.js"
import { getNested } from "../utils/helpers.js"

export function mountBind(el, state) {
  const bindVal = el.dataset.bind
  if(!bindVal || !bindVal.includes(":")) return
  
  const [attr, path] = bindVal.split(":").map(p => p.trim())
  
  const read = getNested(state, path)
  if(typeof read !== "function") {
    throw new Error(`[bind] ${path} is not a signal`);
  }
  
  const bindDispose = effect(() => {
    const val = read()
    
    if(val === null || val === undefined) {
      el.removeAttribute(attr)
    } else if(val === true) {
      el.setAttribute(attr, "")
    } else if(val === false) {
      el.removeAttribute(attr)
    } else {
      el.setAttribute(attr, val)
    }
  })
  
  //legacy code
  // el.querySelectorAll("[data-bind]").forEach(bindEl => {
    
  // })
  
  return bindDispose
}