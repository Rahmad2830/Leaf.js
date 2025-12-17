import { effect } from "../reactivity.js"
import { getNested } from "../utils.js"
import { setListener } from "./listener.js"

function enter(el, animate) {
  el.style.display = ""
  el.style.transition = animate
  el.style.opacity = 0
  el.style.transform = "translateY(-10px)"

  requestAnimationFrame(() => {
    el.style.opacity = 1
    el.style.transform = "translateY(0)"
  })

  setListener(el, "transitionend", () => {
    el.style.transition = ""
    el.style.opacity = ""
    el.style.transform = ""
  })
}

function leave(el, animate) {
  el.style.transition = animate
  el.style.opacity = 0
  el.style.transform = "translateY(-10px)"

  setListener(el, "transitionend", () => {
    el.style.display = "none"
    el.style.transition = ""
    el.style.opacity = ""
    el.style.transform = ""
  })
}

export function mountShow(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-show]").forEach(showEl => {
    const showVal = showEl.dataset.show
    if(!showVal) return
    const attrAnimate = showEl.hasAttribute("data-animate")
    const animate = showEl.getAttribute("data-animate") || "opacity 0.3s ease, transform 0.3s ease"
    
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
          enter(showEl, animate)
        } else {
          leave(showEl, animate)
        }
      }
    })
    disposers.push(showDispose)
  })
  
  return () => disposers.forEach(fn => fn())
}