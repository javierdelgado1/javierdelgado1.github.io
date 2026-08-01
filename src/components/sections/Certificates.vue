<template>
  <div>
    <!-- Section -->
    <section id="certificates" class="bg-white">
      <div class="section-content">
        <h3 class="text-muted" v-html="$t('menu.certificates')"></h3>
        <div class="row">
          <div
            class="image"
            v-for="(image, imageIndex) in images"
            :key="imageIndex"
            @click="show(imageIndex)"
            :style="{ backgroundImage: 'url(' + image + ')', width: '300px', height: '200px' }"
          >
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox (reemplazo de vue-gallery) -->
    <vue-easy-lightbox :visible="visible" :imgs="images" :index="index" @hide="visible = false"></vue-easy-lightbox>
  </div>
</template>

<script>
import VueEasyLightbox from 'vue-easy-lightbox'
import { imagesCertificates } from '../data'

export default {
  components: { VueEasyLightbox },
  data() {
    return {
      images: [],
      index: 0,
      visible: false
    }
  },
  mounted() {
    const datos = imagesCertificates
    this.images = []
    for (const key in datos) {
      this.images.push(datos[key])
    }
  },
  methods: {
    show(imageIndex) {
      this.index = imageIndex
      this.visible = true
    }
  }
}
</script>

<style scoped>
.image {
  float: left;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid #ebebeb;
  margin: 5px;
  cursor: pointer;
}
</style>