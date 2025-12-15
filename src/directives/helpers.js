import { getNested } from "../utils.js"

export function resolveParams(param, scope) {
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
    return resolve(p)
  })
  return pm
}

export function eventModifier(mod = [], e) {
  if(mod.includes("prevent")) {
    e.preventDefault()
  }
  if(mod.includes("stop")) {
    e.stopPropagation()
  }
}