import { getNested } from "../utils.js"
import { resolveParams, eventModifier } from "./helpers.js"
import { setListener, clearListener } from "./listener.js"

export function mountOn(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-on]").forEach(onEl => {
    const onVal = onEl.dataset.on
    if(!onVal || !onVal.includes(":")) return
    const [eventWithMod, handlerPath] = onVal.split(":").map(p => p.trim())
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
      } else {
        throw new Error(`[Listener] ${handlerPath} must be a function`);
      }
    }
    
    setListener(onEl, event, listener)
    disposers.push(() => {
      clearListener(onEl, event)
    })
  })
  
  return () => disposers.forEach(fn => fn())
}