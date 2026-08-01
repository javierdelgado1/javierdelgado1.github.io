<template>
  <!-- Header -->
  <header id="header" class="bg-primary">
    <!-- Top Bar -->
    <div id="top-bar">
      <div class="container">
        <nav class="menu module left">
          <a href="#" v-scroll-to="'#home'" class="active" v-html="$t('menu.home')"></a>
        </nav>
        <nav class="language menu module right">
          <span v-html="$t('menu.languajeVersion')"></span>
          <a :class="{ active: language === 'en' }" @click="changeLanguage('en')" href="#" v-html="$t('menu.english')"></a>
          <a :class="{ active: language === 'es' }" @click="changeLanguage('es')" href="#" v-html="$t('menu.spanish')"></a>
        </nav>
      </div>
    </div>

    <!-- Navigation Bar -->
    <div id="nav-bar" class="container">
      <nav>
        <ul id="nav-primary" class="nav nav-primary">
          <li class="icon-link">
            <a href="#" v-scroll-to="'#home'"><i class="fa fa-home"></i></a>
          </li>
          <li v-if="menu.about">
            <a href="#" v-scroll-to="'#about'" v-html="$t('menu.about')"></a>
          </li>
          <li v-if="menu.skills">
            <a href="#" v-scroll-to="'#skills'" v-html="$t('menu.skills')"></a>
          </li>
          <li v-if="menu.works">
            <a href="#" v-scroll-to="'#works'" v-html="$t('menu.works')"></a>
          </li>
          <li v-if="menu.experience">
            <a href="#" v-scroll-to="'#experience'" v-html="$t('menu.experience')"></a>
          </li>
          <li v-if="menu.services">
            <a href="#" v-scroll-to="'#services'" v-html="$t('menu.service')"></a>
          </li>
          <li v-if="menu.references">
            <a href="#" v-scroll-to="'#references'" v-html="$t('menu.references')"></a>
          </li>
          <li v-if="menu.lastestPost">
            <a href="#" v-scroll-to="'#latest-posts'" v-html="$t('menu.lastestPost')"></a>
          </li>
          <li v-if="menu.certificates">
            <a href="#" v-scroll-to="'#certificates'" v-html="$t('menu.certificates')"></a>
          </li>
        </ul>
      </nav>

      <div class="mobile-nav clearfix">
        <div class="owner">
          <img src="https://javierdelgado.com.ve/apps/portfolio/src/assets/img/avatars/avatar_square_sm.jpg" alt="">
          <span class="name" v-html="$t('myname')"></span>
        </div>
        <a href="#" class="panel-toggle" @click.prevent="togglePanel"><span><span></span></span></a>
      </div>
    </div>
  </header>
  <!-- Header / End -->
</template>

<script>
import i18n from '../../i18n'
import { query_menu } from '../data'

export default {
  data() {
    return { menu: {} }
  },
  mounted() {
    this.menu = query_menu
  },
  methods: {
    changeLanguage(lang) {
      i18n.global.locale.value = lang
      localStorage.setItem('vue-lang', lang)
    },
    togglePanel() {
      document.body.classList.toggle('panel-open')
    }
  }
}
</script>