export const LocalScope = {}

export function defineScope(name, setup) {
  LocalScope[name] = setup()
}