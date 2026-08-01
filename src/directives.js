// Reemplazo de vue-scrollto: directiva v-scroll-to="'#id'" con scrollIntoView nativo.
export const vScrollTo = {
  mounted(el, binding) {
    el.addEventListener('click', (event) => {
      const selector = binding.value
      if (!selector) return
      event.preventDefault()
      const target = document.querySelector(selector)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }
}