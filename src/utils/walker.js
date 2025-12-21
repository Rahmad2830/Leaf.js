export function walk(el, scope, handlers) {
  const disposers = []

  handlers.forEach(fn => {
    const dispose = fn(el, scope, walk, handlers)
    if (typeof dispose === "function") {
      disposers.push(dispose)
    }
  })

  Array.from(el.children).forEach(child => {
    const dispose = walk(child, scope, handlers)
    if (dispose) disposers.push(dispose)
  })

  return () => disposers.forEach(fn => fn())
}