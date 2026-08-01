<template>
  <!-- Section -->
  <section id="experience" class="bg-white">
    <div class="section-content">
      <h3 class="text-muted" v-html="$t('menu.experience')"></h3>
      <div class="timeline" v-if="render">
        <div class="timeline-event animated bounceInLeft appear-animation-visible" data-appear-animation="bounceInLeft" data-appear-animation-delay="800" style="animation-delay: 800ms;" v-for="(exp, index) in experiences" :key="index">
          <div class="date"><span>{{ exp.date }}</span></div>
          <div class="content">
            <img v-if="exp.hasImagePreview" :src="exp.urlImage" alt="" class="img-rounded">
            <h3>{{ exp.title }}</h3>
            <span class="caption">{{ exp.place }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { query_experience } from '../data'

export default {
  data() {
    return { experiences: [], render: false }
  },
  mounted() {
    this.experiences = query_experience
    this.render = true
  }
}
</script>