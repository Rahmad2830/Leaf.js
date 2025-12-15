import { getNested } from "../utils.js"
import { resolveParams, eventModifier } from "./helpers.js"
import { setListener } from "./listener.js"

export function mountOn(el, scope) {
  el.querySelectorAll("[data-on]").forEach(onEl => {
    const [eventWithMod, handlerPath] = onEl.dataset.on.split(":")
    const parts = eventWithMod.split(".")
    const event = parts[0]
    const modifier = parts.slice(1)
    
    const params = onEl.dataset.param ? onEl.dataset.param.split(",").map(p => p.trim()) : []
    
    const listener = (e) => {
      eventModifier(modifier, e)
      if(!handlerPath) return
      const path = getNested(scope, handlerPath)
      
      if(typeof path === "function") {
        const param = resolveParams(params, scope)
        path(...param, e)
      }
    }
    
    setListener(onEl, event, listener)
  })
  
  return null
}