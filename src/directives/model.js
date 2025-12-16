import { effect } from "../reactivity.js"
import { getNested, capitalize } from "../utils.js"
import { setListener, clearListener } from "./listener.js"

//read
function renderModel(el, value) {
  if(el.type === "checkbox") {
    if(Array.isArray(value)) {
      el.checked = value.includes(el.value)
    } else {
      el.checked = !!value
    }
    return
  }
  
  if(el.type === "radio") {
    el.checked = value === el.value
    return
  }
  
  el.value = value ?? ""
}

//write
function getInputValue(el, model) {
  if(el.type === "checkbox") {
    if(Array.isArray(model())) {
      if(el.checked) {
        return [...model(), el.value]
      } else {
        return model().filter(p => p !== el.value)
      }
    } else {
      return el.checked
    }
  }
  
  if(el.type === "radio") {
    if(el.checked) {
      return el.value
    } else {
      return model()
    }
  } 
  
  return el.value
}

export function mountModel(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-model]").forEach(modelEl => {
    const path = modelEl.dataset.model
    if(!path) return
    const read = getNested(scope, path)
    const write = getNested(scope, "set" + capitalize(path))
    
    if(typeof read !== "function" || typeof write !== "function") {
      throw new Error(
      `[model] "${path}" requires signal "${path}()" and setter "set${capitalize(path)}()"`
      )
    }
    
    const modelDispose = effect(() => {
      renderModel(modelEl, read())
    })
    
    const listener = (e) => {
      write(getInputValue(modelEl, read))
    }
    
    setListener(modelEl, "input", listener)
    setListener(modelEl, "change", listener)
    disposers.push(() => {
      modelDispose()
      clearListener(modelEl, "input")
      clearListener(modelEl, "change")
    })
  })
  
  return () => disposers.forEach(fn => fn())
}