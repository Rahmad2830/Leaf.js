import { getNested } from "../utils/helpers.js"

export function mountInit(el, scope) {
  const initVal = el.dataset.init
  if(!initVal) return
  
  const path = getNested(scope, initVal)
  if(typeof path === "function") {
    path()
  } else {
    throw new Error(`[init] ${initVal} must be a function`);
  }
}