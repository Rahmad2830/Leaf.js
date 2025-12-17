import { effect } from "../reactivity.js"
import { getNested } from "../utils.js"
import { setListener } from "./listener.js"

function enter(el, animate) {
  // Cancel ongoing transition
  el.style.transition = "none"
  el.style.display = ""
  
  requestAnimationFrame(() => {
    el.style.opacity = 0
    el.style.transform = "translateY(-10px)"
    
    requestAnimationFrame(() => {
      el.style.transition = animate
      el.style.opacity = 1
      el.style.transform = "translateY(0)"
    })
  })

  setListener(el, "transitionend", (e) => {
    if (e.propertyName === "transform") {
      el.style.transition = ""
      el.style.opacity = ""
      el.style.transform = ""
    }
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
    
    let isInitialRender = true 

    const showDispose = effect(() => {
      const valueFunc = getNested(scope, showVal)
      if(typeof valueFunc !== "function") throw new Error(`[show] ${showVal} must be a function`)
      
      const shouldShow = valueFunc() 
      
      if (isInitialRender) {
        if (shouldShow) {
          showEl.style.display = ""
          showEl.style.opacity = "1"
          showEl.style.transform = "translateY(0)"
        } else {
          showEl.style.display = "none"
        }

        if(showEl.hasAttribute("data-cloak")) {
          showEl.removeAttribute("data-cloak")
        }
        
        isInitialRender = false
        return
      }

      if(!attrAnimate) {
        if(shouldShow) {
          showEl.style.display = ""
        } else {
          showEl.style.display = "none"
        }
      } else {
        if(shouldShow) {
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
