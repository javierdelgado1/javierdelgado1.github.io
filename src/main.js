import { createApp } from 'vue'
import App from './components/App.vue'

import i18n from './i18n'
import { vScrollTo } from './directives'
import Typer from './components/Typer.vue'

// Estilos del template (se refinan en la Fase 5)
import './assets/css/styles.css'
import './assets/css/custom.css'
import './assets/css/themes/theme-blue.css'

const app = createApp(App)

app.use(i18n)

// `language` reactivo global (reemplaza this.language de vue-multilanguage)
// para que los v-if="language=='es'" existentes sigan funcionando.
app.mixin({
  computed: {
    language() {
      return i18n.global.locale.value
    }
  }
})

// Directiva v-scroll-to (reemplazo de vue-scrollto)
app.directive('scroll-to', vScrollTo)

// Componente global <vue-typer> (reemplazo de vue-typer)
app.component('vue-typer', Typer)

app.mount('#app')