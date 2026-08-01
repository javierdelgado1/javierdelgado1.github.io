<template>
  <div id="app">
    <Loader />
    <!-- BG Image -->
    <div class="bg-body bg-image zooming">
      <img src="https://javierdelgado.com.ve/apps/portfolio/src/assets/img/photos/bg_frontend.jpg" alt="">
    </div>
    <Header />

    <!-- Content -->
    <div id="content" class="container">
      <div id="photo">
        <img src="https://javierdelgado.com.ve/apps/portfolio/src/assets/img/avatars/avatar.jpg" alt="">
      </div>
      <div id="sections-wrapper">
        <Home v-if="menu.home" :socials="socials" />
        <About v-if="menu.about" />
        <Skill v-if="menu.skills" />
        <PromoVideo v-if="menu.promoVideo" />
        <Services v-if="menu.services" />
        <Pricing v-if="menu.princing" />
        <Works v-if="menu.works" />
        <Experience v-if="menu.experience" />
        <Reference v-if="menu.reference" />
        <LastestPost v-if="menu.lastestPost" />
        <Certificates v-if="menu.certificates" />
      </div>
    </div>

    <!-- Share -->
    <div id="share-it">
      <a href="#" class="icon icon-circle icon-share"><i class="fa fa-share-alt"></i></a>
      <ul class="share-list">
        <li v-for="(social, index) in visibleSocials" :key="index">
          <a :href="social.url" target="_blank" class="icon icon-circle" :class="social.class">
            <i :class="social.fa"></i>
          </a>
        </li>
      </ul>
    </div>

    <Others />

    <!-- Project modal (reactivo, reemplaza el ajax-modal jQuery) -->
    <div v-if="showProject" id="ajax-modal" class="loading-finished">
      <Project :work="currentWork" @close="closeProject" />
    </div>
  </div>
</template>

<script>
import Loader from './layouts/Loader.vue'
import Header from './layouts/Header.vue'
import Home from './sections/Home.vue'
import About from './sections/About.vue'
import Skill from './sections/Skill.vue'
import PromoVideo from './sections/PromoVideo.vue'
import Services from './sections/Services.vue'
import Pricing from './sections/Pricing.vue'
import Works from './sections/Works.vue'
import Experience from './sections/Experience.vue'
import Reference from './sections/Reference.vue'
import LastestPost from './sections/LastestPost.vue'
import Certificates from './sections/Certificates.vue'
import Others from './layouts/Others.vue'
import Project from './sections/Project.vue'
import { query_menu, query_socials } from './data'
import { eventBus } from './global'

export default {
  name: 'app',
  components: {
    Loader, Header, Home, About, Skill, PromoVideo, Services, Pricing,
    Works, Experience, Reference, LastestPost, Certificates, Others, Project
  },
  data() {
    return {
      socials: [],
      menu: {},
      showProject: false,
      currentWork: {}
    }
  },
  computed: {
    visibleSocials() {
      return (this.socials || []).filter(s => s.isVisible)
    }
  },
  created() {
    eventBus.on('showProject', (work) => {
      this.currentWork = work
      this.showProject = true
      document.documentElement.classList.add('locked-scrolling')
    })
  },
  mounted() {
    this.menu = query_menu
    this.socials = query_socials
  },
  methods: {
    closeProject() {
      this.showProject = false
      document.documentElement.classList.remove('locked-scrolling')
    }
  }
}
</script>