import { effect } from "../reactivity.js"
import { getNested } from "../utils.js"
import { mountText } from "./text.js"
import { mountOn } from "./on.js"
import { mountShow } from "./show.js"
import { mountBind } from "./bind.js"

function mountLoop(el, scope) {
  const disposers = []
  
  const textDispose = mountText(el, scope)
  if(textDispose) disposers.push(textDispose)
  
  const onDispose = mountOn(el, scope)
  if(onDispose) disposers.push(onDispose)
  
  const showDispose = mountShow(el, scope)
  if(showDispose) disposers.push(showDispose)
  
  const mountDispose = mountBind(el, scope)
  if(mountDispose) disposers.push(mountDispose)
  
  return () => disposers.forEach(fn => fn())
}

export function mountFor(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-for]").forEach(forEl => {
    const template = forEl.querySelector("template")
    if(!template) return
    const forVal = forEl.dataset.for
    if(!forVal) return
    
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
        const nodes = Array.from(clone.children)
        
        const loopScope = {
          ...scope,
          $item: item,
          $index: index
        }
          
        nodes.forEach(node => {
          const dispose = mountLoop(node, loopScope)
          itemCleanups.push(dispose)
        })
        forEl.appendChild(clone)
        
      })
    })
    disposers.push(() => {
      forDisposer()
      itemCleanups.forEach(fn => fn())
      itemCleanups = []
    })
  })
  
  return () => disposers.forEach(fn => fn())
}