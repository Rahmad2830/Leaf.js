import { effect } from "../reactivity.js"
import { getNested } from "../utils.js"

export function mountClass(el, scope) {
  const disposers = []
  
  el.querySelectorAll("[data-class]").forEach(classEl => {
    const mappings = classEl.dataset.class.split(",")
    if(!mappings) return
    mappings.forEach(part => {
      if(!part.trim()) return
      const [fn, ...clsPath] = part.split(":")
      if(!fn) {
        throw new Error(`[class] a function is required for adding class`);
      } else if(clsPath.length === 0) {
        throw new Error(`[class] a class is required for adding class`);
      }
      const raw = clsPath.join(":").trim()
      const cls = raw.replace(/^['"]|['"]$/g, "")
      const classDispose = effect(() => {
        const path = getNested(scope, fn.trim())
        if(typeof path === "function") {
          cls.split(/\s+/).forEach(c => {
            if (!c) return
            classEl.classList.toggle(c, path())
          })
        } else {
          throw new Error(`[class] ${fn} must be a function`)
        }
      })
      disposers.push(classDispose)
    })
  })
  return () => disposers.forEach(fn => fn())
}