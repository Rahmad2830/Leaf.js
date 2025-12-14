export function getNested(obj, path) {
  const parts = path.split(".")
  let current = obj
  
  for(const part of parts) {
    current = current[part]
    if(current === undefined) return undefined
  }
  return current
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}