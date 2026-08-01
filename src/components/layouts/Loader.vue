<template>
  <!-- Loader (se oculta solo al cargar la pagina; reemplaza el fadeOut de core.js) -->
  <div id="page-loader" class="bg-white" :class="{ 'is-hidden': !visible }">
    <svg class="loader" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <circle class="circle" fill="none" stroke-width="3" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
  </div>
  <!-- Loader / End -->
</template>

<script>
export default {
  data() {
    return { visible: true }
  },
  mounted() {
    const hide = () => { this.visible = false }
    if (document.readyState === 'complete') {
      setTimeout(hide, 300)
    } else {
      window.addEventListener('load', () => setTimeout(hide, 300), { once: true })
    }
    // Fallback por si el evento load no llega
    setTimeout(hide, 2000)
  }
}
</script>

<style scoped>
#page-loader.is-hidden {
  display: none;
}
</style>