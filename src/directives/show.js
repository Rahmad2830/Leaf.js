import { effect } from "../reactivity.js"
import { getNested } from "../utils/helpers.js"
import { setListener, clearListener} from "../utils/listener.js"

export function mountShow(el, scope) {
  if(el.hasAttribute("data-init-hide")) {
    el.removeAttribute("data-init-hide")
    el.style.display = "none"
  }
    
  const showVal = el.dataset.show
  if(!showVal) return
  
  const value = getNested(scope, showVal)
  if(typeof value !== "function") throw new Error(`[show] ${showVal} must be a function`)
  
  const attrAnimate = el.hasAttribute("data-animate")
  const animate = el.dataset.animate || "opacity 0.5s ease, transform 0.5s ease"
  
  //animation state
  let hiding = false
  
  const onTransitionEnd = () => {
    if(!value()) {
      el.style.display = "none"
      hiding = false
    }
  }
  
  if (attrAnimate) {
    el.style.transition = animate
    setListener(el, "transitionend", onTransitionEnd)
  }
  
  const showDispose = effect(() => {
    if(!attrAnimate) {
      el.style.display = value() ? "" : "none"
      return
    }
    if(value()) {
      el.style.display = ""
      el.style.opacity = "0"
      el.style.transform = "translateY(-10px)"
    
      requestAnimationFrame(() => {
        el.style.opacity = "1"
        el.style.transform = "translateY(0)"
      })
    } else if(!hiding) {
      hiding = true
      el.style.opacity = "0"
      el.style.transform = "translateY(-10px)"
      el.style.transition = animate
    }
  })
  
  //legacy code using querySelectorAll
  // el.querySelectorAll("[data-show]").forEach(el => {
    
  // })
  
  return () => {
    showDispose()
    if(attrAnimate) clearListener(el, "transitionend")
  }
}