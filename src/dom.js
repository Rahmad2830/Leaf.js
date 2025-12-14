import { effect } from "./reactivity.js"
import { getNested, capitalize } from "./utils.js"
import { LocalScope } from "./scope.js"

const ListenerCache = new WeakMap()

function clearListener(el, event) {
  let eventMap = ListenerCache.get(el)
  if (!eventMap) return
  
  const oldListener = eventMap[event]
  if (!oldListener) return
  
  el.removeEventListener(event, oldListener)
  delete eventMap[event]
  
  if(Object.keys(eventMap).length === 0) {
    ListenerCache.delete(el)
  }
}

//directive inside loop
function mountLoop(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-text]").forEach(textEl => {
    const path = textEl.dataset.text
    const val = getNested(scope, path)
    
    const textDispose = effect(() => {
      textEl.textContent = typeof val === "function" ? val() : val
    })
    disposers.push(textDispose)
  })
  
  return () => disposers.forEach(fn => fn())
}

//init directive
export function mount() {
  document.querySelectorAll("[data-scope]").forEach(el => {
    const state = LocalScope[el.dataset.scope]
    
    el.querySelectorAll("[data-text]").forEach(textEl => {
      const textVal = textEl.dataset.text
      const val = getNested(state, textVal)
      effect(() => {
        textEl.textContent = val()
      })
    })
    
    el.querySelectorAll("[data-on]").forEach(onEl => {
      const onVal = onEl.dataset.on.split(":")
      const event = onVal[0]
      
      const listener = () => {
        const path = getNested(state, onVal[1])
        if(typeof path === "function") {
          path()
        }
      }
      
      let eventMap = ListenerCache.get(onEl)
      if (!eventMap) {
        eventMap = {}
        ListenerCache.set(onEl, eventMap)
      }
      
      clearListener(onEl, event)
      
      onEl.addEventListener(event, listener)
      eventMap[event] = listener
    })
    
    //conditional handling
    el.querySelectorAll("[data-if]").forEach(ifEl => {
      const ifVal = ifEl.dataset.if
      const path = getNested(state, ifVal)
      
      effect(() => {
        if(path()) {
          ifEl.style.display = ""
        } else {
          ifEl.style.display = "none"
        }
      })
    })
    
    //looping
    el.querySelectorAll("[data-for]").forEach(forEl => {
      const template = forEl.querySelector("template")
      const path = forEl.dataset.for
      
      let itemCleanups = []
      
      effect(() => {
        const list = getNested(state, path)()
        
        itemCleanups.forEach(fn => fn())
        itemCleanups = []
        
        Array.from(forEl.childNodes).forEach(node => {
          if(node !== template) {
            node.remove()
          }
        })
        list.forEach((item, index) => {
          const clone = template.content.cloneNode(true)
          const scope = {
            ...state,
            $item: item,
            $index: index
          }
          const dispose = mountLoop(clone, scope)
          itemCleanups.push(dispose)
          forEl.appendChild(clone)
        })
      })
    })
    
    // two way binding
    el.querySelectorAll("[data-model]").forEach(modelEl => {
      const path = modelEl.dataset.model
      const read = getNested(state, path)
      const write = getNested(state, "set"+ capitalize(path))
      
      effect(() => {
        const v = read()
        if (modelEl.value !== v) {
          modelEl.value = v ?? ""
        }
      })
      
      let eventMap = ListenerCache.get(modelEl)
      if(!eventMap) {
        eventMap = {}
        ListenerCache.set(modelEl, eventMap)
      }
      
      const listener = (e) => {
        if(typeof write === "function") {
          write(e.target.value)
        }
      }
      
      clearListener(modelEl, "input")
    
      modelEl.addEventListener("input", listener)
      eventMap["input"] = listener
    })
  })
}