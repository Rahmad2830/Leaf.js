import { effect } from "../reactivity.js"
import { getNested } from "../utils.js"

export function mountText(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-text]").forEach(textEl => {
    const path = textEl.dataset.text
    if(!path) return
    
    const textDispose = effect(() => {
      const val = getNested(scope, path)
      textEl.textContent = typeof val === "function" ? val() : val
    })
    disposers.push(textDispose)
  })
  
  return () => disposers.forEach(fn => fn())
}