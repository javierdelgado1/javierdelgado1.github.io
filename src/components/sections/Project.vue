<template>
  <div class="ajax-modal-wrapper">
    <div class="ajax-title-bar">
      <div class="container">
        <span class="title">{{ work.name }}</span>
        <a href="#" class="ajax-close icon icon-circle icon-secondary" @click.prevent="$emit('close')"><i class="ti-close"></i></a>
      </div>
    </div>
    <div class="ajax-content">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <Splide v-if="hasScreenshots" :options="{ perPage: 1, arrows: true, pagination: true }">
              <SplideSlide v-for="(img, index) in work.screenshots" :key="index">
                <img :src="img" alt="">
              </SplideSlide>
            </Splide>
            <hr class="tall">
            <ul>
              <li>
                <p v-html="$t('works.tecnologiesUsed')"></p>
                <ul class="list list-skills icons list-unstyled list-inline">
                  <li v-for="(tech, index) in (work.tecnologies || [])" :key="index"><i class="fa fa-check-circle"></i> {{ tech }}</li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <section>
              <h4 v-html="$t('works.description')"></h4>
              <div v-if="language === 'es'">
                <p class="taller">{{ work.description_es }}</p>
              </div>
              <div v-else>
                <p class="taller">{{ work.description_en }}</p>
              </div>
            </section>
            <div v-if="work.hasDetail === true || work.hasDetail === 'true'">
              <h4 v-html="$t('works.details')"></h4>
              <p class="taller"></p>
              <ul v-if="language === 'es'">
                <li v-for="(detail, index) in (work.details_es || [])" :key="index">{{ detail }}</li>
              </ul>
              <ul v-else>
                <li v-for="(detail, index) in (work.details_en || [])" :key="index">{{ detail }}</li>
              </ul>
              <p></p>
            </div>
            <div class="row">
              <div class="col-md-6"></div>
              <div class="col-md-6">
                <a :href="work.urlProject" target="_blank" class="btn btn-primary btn-icon">
                  <i class="fa fa-external-link"></i>
                  <label v-html="$t('works.viewDemo')"></label>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import '@splidejs/vue-splide/css'

export default {
  components: { Splide, SplideSlide },
  props: {
    work: { type: Object, default: () => ({}) }
  },
  computed: {
    hasScreenshots() {
      return Array.isArray(this.work.screenshots) && this.work.screenshots.length > 0
    }
  }
}
</script>