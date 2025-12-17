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

export function computed(fn) {
  let cached
  let dirty = true
  const deps = new Set()
  
  const runner = effect(() => {
    cached = fn()
    dirty = false
  })
  
  return {
    get value() {
      const activeEffect = effectStack[effectStack.length - 1]
      if(activeEffect) {
        deps.add(activeEffect)
        activeEffect.deps.add(deps)
      }
      
      if(dirty) {
        runner()
      }
      return cached
    }
  }
}