const ListenerCache = new WeakMap()

export function clearListener(el, event) {
  let eventMap = ListenerCache.get(el)
  if (!eventMap) return
  
  const oldListener = eventMap[event]
  if (!oldListener) return
  
  el.removeEventListener(event, oldListener)
  delete eventMap[event]
  
  if(Object.keys(eventMap).length === 0) {
    ListenerCache.delete(el)
  }
}

export function setListener(el, event, listener) {
  let eventMap = ListenerCache.get(el)
  if (!eventMap) {
    eventMap = {}
    ListenerCache.set(el, eventMap)
  }
  
  clearListener(el, event)
  el.addEventListener(event, listener)
  eventMap[event] = listener
}