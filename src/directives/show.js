import { effect } from "../reactivity.js"
import { getNested } from "../utils.js"
import { setListener } from "./listener.js"

export function mountShow(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-show]").forEach(showEl => {
    
    if(showEl.hasAttribute("data-init-hide")) {
      showEl.removeAttribute("data-init-hide")
      showEl.style.display = "none"
    }
    
    const showVal = showEl.dataset.show
    if(!showVal) return
    const attrAnimate = showEl.hasAttribute("data-animate")
    const animate = showEl.dataset.animate || "opacity 0.5s ease, transform 0.5s ease"
    
    const showDispose = effect(() => {
      const value = getNested(scope, showVal)
      if(typeof value !== "function") throw new Error(`[show] ${showVal} must be a function`)
      
      if(!attrAnimate) {
        if(value()) {
          showEl.style.display = ""
        } else {
          showEl.style.display = "none"
        }
      } else {
        if(value()) {
          showEl.style.display = ""
          showEl.style.opacity = "0"
          showEl.style.transform = "translateY(-10px)"
        
          requestAnimationFrame(() => {
            showEl.style.opacity = "1"
            showEl.style.transform = "translateY(0)"
          })
        } else {
          showEl.style.opacity = "0"
          showEl.style.transform = "translateY(-10px)"
          showEl.style.transition = animate
        
          setListener(showEl, "transitionend", () => {
            if(!value()) {
              showEl.style.display = "none"
            }
          })
        }
      }
    })
    disposers.push(showDispose)
  })
  
  return () => disposers.forEach(fn => fn())
}