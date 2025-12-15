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

function resolveParams(param, scope) {
  function resolve(p) {
    if(p === "true") return true
    if(p === "false") return false
    if(p === "null") return null
    if(p === "undefined") return undefined
    
    if(!isNaN(p) && p.trim() !== "") {
      return Number(p)
    }
    
    return p
  }
  const pm = param.map(p => {
    const val = getNested(scope, p)
    if(val !== undefined) {
      return typeof val === "function" ? val() : val
    }
    //fallback raw string
    return resolve(p)
  })
  return pm
}

function eventModifier(mod = [], e) {
  if(mod.includes("prevent")) {
    e.preventDefault()
  }
  if(mod.includes("stop")) {
    e.stopPropagation()
  }
}

//directive inside loop
function mountLoop(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-text]").forEach(textEl => {
    const path = textEl.dataset.text
    
    const textDispose = effect(() => {
      const val = getNested(scope, path)
      textEl.textContent = typeof val === "function" ? val() : val
    })
    disposers.push(textDispose)
  })
  
  el.querySelectorAll("[data-on]").forEach(onEl => {
      const [eventWithMod, handlerPath] = onEl.dataset.on.split(":")
      const parts = eventWithMod.split(".")
      const event = parts[0]
      const modifier = parts.slice(1)
      
      const params = onEl.dataset.param ? onEl.dataset.param.split(",").map(p => p.trim()) : []
      
      const listener = (e) => {
        const path = getNested(scope, handlerPath)
        if(typeof path === "function") {
          eventModifier(modifier, e)
          const param = resolveParams(params, scope)
          path(...param, e)
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
      const [eventWithMod, handlerPath] = onEl.dataset.on.split(":")
      const parts = eventWithMod.split(".")
      const event = parts[0]
      const modifier = parts.slice(1)
      
      const params = onEl.dataset.param ? onEl.dataset.param.split(",").map(p => p.trim()) : []
      
      const listener = (e) => {
        const path = getNested(state, handlerPath)
        
        if(typeof path === "function") {
          eventModifier(modifier, e)
          const param = resolveParams(params, state)
          
          path(...param, e)
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
    
    //lifecycle
    const onInit = el.querySelector("[data-init]") || el
    const initVal = onInit.dataset.init
    if(initVal) {
      const path = getNested(state, initVal)
      if(typeof path === "function") {
        path()
      }
    }
    
    
  })
}