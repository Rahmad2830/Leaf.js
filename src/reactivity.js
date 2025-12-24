import { getNested } from "./utils/helpers.js"

let effectStack = []

function cleanup(effectFn) {
  if(effectFn.deps) {
    effectFn.deps.forEach(subs => {
      subs.delete(effectFn)
    })
    effectFn.deps.clear()
  }
}

export function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
  }
  
  effectFn.deps = new Set()
  effectFn()
  
  return () => cleanup(effectFn)
}

export function signal(initial) {
  let value = initial
  const subs = new Set()
  
  const read = () => {
    const activeEffect = effectStack[effectStack.length - 1]
    if (activeEffect) {
      subs.add(activeEffect)
      activeEffect.deps.add(subs)
    }
    return value
  }
  const write = (v) => {
    if(Object.is(value, v)) return
    value = v
    const effect = new Set(subs)
    effect.forEach(fn => fn())
  }
  return [read, write]
}

//signal object value helper
//Im thinking bout something that work with the object value and dont wanna use proxy
//to keep the library small.
export function produce(fn) {
  return prev => {
    const next = structuredClone(prev)
    fn(next)
    return next
  }
}

export function pick(obj, path) {
  const out = {}
  
  for(const key in path) {
    const p = path[key]
    out[key] = () => {
      const value = signal()
      return getNested(value, path)
    }
  }
  
  return out
}