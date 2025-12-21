import { resolveParams, eventModifier, getNested } from "../utils/helpers.js"
import { setListener, clearListener } from "../utils/listener.js"

export function mountOn(el, scope) {
  const onVal = el.dataset.on
  if(!onVal) return
  
  const [eventWithMod, handlerPath] = onVal.split(":").map(p => p.trim())
  const parts = eventWithMod.split(".")
  const event = parts[0]
  const modifier = parts.slice(1)
  
  const params = el.dataset.param ? el.dataset.param.split(",").map(p => p.trim()) : []
  
  const listener = (e) => {
    eventModifier(modifier, e)
    if(!handlerPath) return
    const path = getNested(scope, handlerPath)
    
    if(typeof path === "function") {
      const param = resolveParams(params, scope)
      path(...param, e)
    } else {
      console.error(`[Listener] ${handlerPath} must be a function`)
    }
  }
  
  setListener(el, event, listener)
  
  //legacy code using querySelectorAll
  // el.querySelectorAll("[data-on]").forEach(onEl => {
    
  // })
  
  return () => clearListener(el, event)
}