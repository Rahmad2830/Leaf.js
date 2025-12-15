import { getNested } from "../utils.js"

export function mountInit(el, scope) {
  const onInit = el.querySelector("[data-init]") || el
  const initVal = onInit.dataset.init
  
  if(initVal) {
    const path = getNested(scope, initVal)
    if(typeof path === "function") {
      path()
    }
  }
  
  return null
}