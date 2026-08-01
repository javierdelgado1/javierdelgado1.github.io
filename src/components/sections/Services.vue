<template>
  <!-- Section -->
  <section id="services" class="bg-white">
    <div class="section-content">
      <h3 class="text-muted" v-html="$t('menu.service')"></h3>
      <div class="row">
        <div class="col-sm-6" v-for="(service, index) in services" :key="index">
          <div class="icon-box icon-box-1 text-center">
            <span class="icon icon-muted icon-xl"><i :class="service.class"></i></span>
            <h3 class="mb-10">{{ service.title }}</h3>
            <p class="lead text-muted" v-if="language === 'es'" v-html="service.description_es"></p>
            <p class="lead text-muted" v-else v-html="service.description_en"></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { query_services } from '../data'

export default {
  data() {
    return { services: [] }
  },
  mounted() {
    this.services = query_services
  }
}
</script>