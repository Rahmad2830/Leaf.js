let activeEffect = null

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
    activeEffect = effectFn
    fn()
    activeEffect = null
  }
  
  effectFn.deps = new Set()
  effectFn()
  
  return () => cleanup(effectFn)
}

export function signal(initial) {
  let value = initial
  const subs = new Set()
  
  const read = () => {
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
  const deps = new Set()
  
  const compDispose = effect(() => {
    //clear prev effect
    deps.forEach(depEff => depEff.deps.delete(compDispose))
    deps.clear()
    
    cached = fn()
    deps.forEach(eff => eff())
  })
  
  return {
    get value() {
      if(activeEffect) {
        deps.add(activeEffect)
        activeEffect.deps.add(deps)
      }
      return cached
    }
  }
}