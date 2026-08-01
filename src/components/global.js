import mitt from 'mitt'

// Reemplazo del eventBus de Vue 2 (Works <-> Project) con mitt.
export const eventBus = mitt()