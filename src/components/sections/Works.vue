<template>
  <!-- Section -->
  <section id="works" class="bg-white">
    <div class="section-content clearfix">
      <h3 class="text-muted mb-0 pull-left" v-html="$t('menu.works')"></h3>
      <nav class="filter tabs-wrapper pull-right">
        <ul class="filter-isotope nav nav-tabs">
          <li :class="{ active: filter === 'all' }"><a href="#" @click.prevent="filter = 'all'">All</a></li>
          <li :class="{ active: filter === 'webdesign' }"><a href="#" @click.prevent="filter = 'webdesign'">Webdesign</a></li>
          <li :class="{ active: filter === 'development' }"><a href="#" @click.prevent="filter = 'development'">Development</a></li>
        </ul>
        <span class="selector"></span>
      </nav>
    </div>

    <div class="works-grid">
      <div
        v-for="(work, index) in filteredWorks"
        :key="index"
        class="work-card image-box image-hover bg-black text-center"
      >
        <div class="image">
          <img :src="work.cover_url" alt="">
        </div>
        <div class="hover">
          <a href="#">
            <h5 class="mb-0">{{ work.name }}</h5>
            <span class="text-muted">{{ work.category }}</span>
          </a>
          <button @click="openProject(work)" class="btn btn-xs btn-white">
            <span v-html="$t('works.viewProject')"></span>
            <span class="i-after i"><i class="ti-desktop"></i><i class="ti-arrow-right"></i></span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { works } from '../data'
import { eventBus } from '../global'

export default {
  data() {
    return {
      allWorks: [],
      filter: 'all'
    }
  },
  computed: {
    filteredWorks() {
      if (this.filter === 'all') return this.allWorks
      return this.allWorks.filter(w => w.category === this.filter)
    }
  },
  mounted() {
    this.allWorks = Object.values(works)
  },
  methods: {
    openProject(work) {
      eventBus.emit('showProject', work)
    }
  }
}
</script>

<style scoped>
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 0 15px;
}
</style>