import { signal, computed, effect } from './reactivity.js'
import { defineScope, defineStore } from './scope.js'
import { mount, unmount } from './mount.js'

export {
  signal,
  computed,
  effect,
  defineScope,
  defineStore,
  mount,
  unmount
}

if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", mount)
}