import { effect } from "../reactivity.js"
import { getNested } from "../utils/helpers.js"

export function mountText(el, scope) {
  const path = el.dataset.text
  if(!path) return
  
  const textDispose = effect(() => {
    const val = getNested(scope, path)
    el.textContent = typeof val === "function" ? val() : val
  })
  
  //legacy code
  // el.querySelectorAll("[data-text]").forEach(textEl => {
  //   const path = textEl.dataset.text
  //   if(!path) return
    
  //   const textDispose = effect(() => {
  //     const val = getNested(scope, path)
  //     textEl.textContent = typeof val === "function" ? val() : val
  //   })
  //   disposers.push(textDispose)
  // })
  
  return textDispose
}