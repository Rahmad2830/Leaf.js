import { signal, effect } from './reactivity.js'
import { defineScope } from './scope.js'
import { mount } from './mount.js'

if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", mount)
}

if (typeof window !== 'undefined') {
  window.signal = signal
  window.defineScope = defineScope
  window.mount = mount
}