import { effect } from "../reactivity.js"
import { getNested } from "../utils/helpers.js"

export function mountFor(el, scope, walk, handlers) {
  const disposers = []
  
  const template = el.querySelector("template")
  if(!template) return
  const forVal = el.dataset.for
  if(!forVal) return
  
  let itemCleanups = []
  
  const forDispose = effect(() => {
    const path = getNested(scope, forVal)
    const list = typeof path === "function" ? path() : path || []
    
    itemCleanups.forEach(fn => fn())
    itemCleanups = []
    
    Array.from(el.childNodes).forEach(node => {
      if(node !== template) {
        node.remove()
      }
    })
    
    list.forEach((item, index) => {
      const clone = template.content.cloneNode(true)
      const nodes = Array.from(clone.children)
      
      const loopScope = {
        ...scope,
        $item: item,
        $index: index
      }
        
      nodes.forEach(node => {
        const dispose = walk(node, loopScope, handlers)
        if(typeof dispose === "function") {
          itemCleanups.push(dispose)
        }
      })
      el.appendChild(clone)
      
    })
  })
  disposers.push(() => {
    forDispose()
    itemCleanups.forEach(fn => fn())
    itemCleanups = []
  })
  
  //legacy code
  // el.querySelectorAll("[data-for]").forEach(forEl => {
    
  // })
  
  return () => disposers.forEach(fn => fn())
}