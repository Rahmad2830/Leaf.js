import { effect } from "../reactivity.js"
import { getNested } from "../utils.js"
import { mountText } from "./text.js"
import { mountOn } from "./on.js"

function mountLoop(el, scope) {
  const disposers = []
  
  const textDispose = mountText(el, scope)
  
  disposers.push(textDispose)
  
  mountOn(el, scope)
  
  return () => disposers.forEach(fn => fn())
}

export function mountFor(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-for]").forEach(forEl => {
    const template = forEl.querySelector("template")
    const forVal = forEl.dataset.for
    
    let itemCleanups = []
    
    const forDisposer = effect(() => {
      const path = getNested(scope, forVal)
      const list = typeof path === "function" ? path() : path || []
      
      itemCleanups.forEach(fn => fn())
      itemCleanups = []
      
      Array.from(forEl.childNodes).forEach(node => {
        if(node !== template) {
          node.remove()
        }
      })
      
      list.forEach((item, index) => {
        const clone = template.content.cloneNode(true)
        const loopScope = {
          ...scope,
          $item: item,
          $index: index
        }
        const dispose = mountLoop(clone, loopScope)
        itemCleanups.push(dispose)
        forEl.appendChild(clone)
      })
    })
    disposers.push(forDisposer)
  })
  
  return () => disposers.forEach(fn => fn())
}