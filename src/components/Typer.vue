<template>
  <span class="typing">{{ display }}</span>
</template>

<script>
// Reemplazo minimalista de vue-typer: escribe el texto caracter a caracter.
export default {
  name: 'Typer',
  props: {
    text: { type: String, default: '' },
    speed: { type: Number, default: 80 }
  },
  data() {
    return { display: '', timer: null, pos: 0 }
  },
  watch: {
    text: { immediate: true, handler() { this.start() } }
  },
  methods: {
    start() {
      clearInterval(this.timer)
      this.display = ''
      this.pos = 0
      const value = this.text || ''
      this.timer = setInterval(() => {
        if (this.pos < value.length) {
          this.display += value[this.pos++]
        } else {
          clearInterval(this.timer)
        }
      }, this.speed)
    }
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>