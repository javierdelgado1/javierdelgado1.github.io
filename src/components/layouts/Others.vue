<template>
  <!-- Panel -->
  <nav id="panel" class="bg-white">
    <div class="panel-wrapper">
      <!-- Photo -->
      <div class="photo">
        <img src="https://javierdelgado.com.ve/apps/portfolio/src/assets/img/avatars/avatar_square.jpg" alt="" width="310" :style="styleImg">
      </div>

      <!-- Menu -->
      <div class="menu widget">
        <h6 v-html="$t('others.name')"></h6>
        <ul id="nav-mobile" class="nav nav-panel">
          <li v-if="menu.home"><a href="#" v-scroll-to="'#home'" v-html="$t('nav.home')"></a></li>
          <li v-if="menu.about"><a href="#" v-scroll-to="'#about'" v-html="$t('nav.about')"></a></li>
          <li v-if="menu.skills"><a href="#" v-scroll-to="'#skills'" v-html="$t('nav.skills')"></a></li>
          <li v-if="menu.works"><a href="#" v-scroll-to="'#works'" v-html="$t('nav.works')"></a></li>
          <li v-if="menu.experience"><a href="#" v-scroll-to="'#experience'" v-html="$t('nav.experience')"></a></li>
          <li v-if="menu.references"><a href="#" v-scroll-to="'#references'" v-html="$t('nav.references')"></a></li>
          <li v-if="menu.services"><a href="#" v-scroll-to="'#services'" v-html="$t('nav.service')"></a></li>
          <li v-if="menu.lastestPost"><a href="#" v-scroll-to="'#latest-posts'" v-html="$t('nav.lastestPost')"></a></li>
          <li v-if="menu.certificates"><a href="#" v-scroll-to="'#certificates'" v-html="$t('nav.certificates')"></a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { query_menu } from '../data'

export default {
  data() {
    return {
      menu: {},
      styleImg: { maxWidth: 'unset' }
    }
  },
  mounted() {
    this.menu = query_menu
  }
}
</script>