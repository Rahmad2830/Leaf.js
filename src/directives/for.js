import { effect } from "../reactivity.js"
import { getNested } from "../utils/helpers.js"


export function mountFor(el, scope, walk, handlers) {
  //for keyed loop
  const listDom = new Map()
  //for non keyed loop
  const doms = []
  //toggle warning when not use data-key attr
  let warningNoKey = false
  
  const template = el.querySelector("template")
  if(!template) return
  const forVal = el.dataset.for
  if(!forVal) return
  
  const parent = el.parentNode
  const anchor = document.createComment("for")
  parent.insertBefore(anchor, el)
  parent.removeChild(el)
  
  const forDispose = effect(() => {
    const path = getNested(scope, forVal)
    if(!path) console.error(`[data-for] ${forVal} is not found`)
    
    const list = typeof path === "function" ? path() : []
    
    const keyExpr = el.dataset.key
    
    // /Concepts/
    // *Keyed loop (data-key)*
    //   - Items can be reordered
    //   - The old DOM is moved, not recreated
    //   - An insertBefore is required
    // *Non-keyed loop*
    //   - The item is assumed to remain at its index position
    //   - There is no concept of reorder
    //   - Simply update the data, without moving the DOM
    
    if(keyExpr) {
      if (doms.length) {
        doms.forEach(d => {
          d.el.remove()
          d.cleanup && d.cleanup()
        })
        doms.length = 0
      }
      const newKeys = new Set()
      let lastEl = anchor
      
      list.forEach((item, index) => {
        //isolated scope
        const loopScope = {
          $item: item,
          $index: index,
          ...scope
        }
          
        const key = getNested(loopScope, keyExpr)
        if (key == null) {
          console.warn(`Invalid key: ${key}`)
          return
        }
        
        if(newKeys.has(key)) {
          console.warn(`Duplicate key detected: ${key}. Rendering behavior may be unpredictable.`)
        }
        newKeys.add(key)
        
        const foundEl = listDom.get(key)
        if(foundEl) {
          foundEl.scope.$item = item
          foundEl.scope.$index = index
          parent.insertBefore(foundEl.el, lastEl.nextSibling)
          lastEl = foundEl.el
        } else {
          const clone = template.content.cloneNode(true)
          const firstEl = clone.firstElementChild
          
          const cleanup = walk(firstEl, loopScope, handlers)
          
          listDom.set(key, { el: firstEl, scope: loopScope, cleanup})
          parent.insertBefore(firstEl, lastEl.nextSibling)
          lastEl = firstEl
        }
      })
      
      listDom.forEach((v, k) => {
        if(!newKeys.has(k)) {
          v.el.remove()
          if(v.cleanup) v.cleanup()
          listDom.delete(k) 
        }
      })
    } else {
      if (listDom.size) {
        listDom.forEach(v => {
          v.el.remove()
          v.cleanup && v.cleanup()
        })
        listDom.clear()
      }
      
      if(!warningNoKey) {
        console.warn(`[data-for="${forVal}"] does not have a data-key. Reuse DOM may be suboptimal.`)
      }
      warningNoKey = true
      
      list.forEach((item, index) => {
        //isolated scope
        const stateLoop = {
          $item: item,
          $index: index,
          ...scope
        }
        
        if(doms[index]) {
          doms[index].scope.$item = item
          doms[index].scope.$index = index
        } else {
          const clone = template.content.cloneNode(true)
          const firstEl = clone.firstElementChild
          
          const cleanup = walk(firstEl, stateLoop, handlers)
          
          doms[index] = { el: firstEl, scope: stateLoop, cleanup }
          parent.insertBefore(firstEl, anchor.nextSibling)
        }
      })
      
      while(doms.length > list.length) {
        const d = doms.pop()
        d.el.remove()
        d.cleanup && d.cleanup()
      }
    }
  })
  
  //legacy code
  // el.querySelectorAll("[data-for]").forEach(forEl => {
    
  // })
  return forDispose
}