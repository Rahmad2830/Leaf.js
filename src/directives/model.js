import { effect } from "../reactivity.js"
import { getNested, capitalize } from "../utils.js"
import { setListener } from "./listener.js"

export function mountModel(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-model]").forEach(modelEl => {
    const path = modelEl.dataset.model
    const read = getNested(scope, path)
    const write = getNested(scope, "set" + capitalize(path))
    
    const modelDispose = effect(() => {
      const v = read()
      if (modelEl.value !== v) {
        modelEl.value = v ?? ""
      }
    })
    
    const listener = (e) => {
      if(typeof write === "function") {
        write(e.target.value)
      }
    }
    
    setListener(modelEl, "input", listener)
    disposers.push(modelDispose)
  })
  
  return () => disposers.forEach(fn => fn())
}