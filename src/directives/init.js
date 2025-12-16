import { getNested } from "../utils.js"

export function mountInit(el, scope) {
  const onInit = el.querySelector("[data-init]") || el
  const initVal = onInit.dataset.init
  if(!initVal) return
  
  if(initVal) {
    const path = getNested(scope, initVal)
    if(typeof path === "function") {
      path()
    } else {
      throw new Error(`[init] ${initVal} must be a function`);
    }
  }
  
  return null
}