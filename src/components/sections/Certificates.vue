<template>
  <div>
    <!-- Section -->
    <section id="certificates" class="bg-white">
      <div class="section-content">
        <h3 class="text-muted" v-lang.menu.certificates></h3>
        <div class="row">
          <gallery :images="images" :index="index" @close="index = null"></gallery>
          <div
            class="image"
            v-for="(image, imageIndex) in images"
            :key="imageIndex"
            @click="index = imageIndex"
            :style="{ backgroundImage: 'url(' + image + ')', width: '300px', height: '200px' }"
          >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import VueGallery from "vue-gallery";
import {firebaseApp, imagesCertificates} from '../firebaseApp'

export default {
  data: function() {
    return {
      images: [],
      index: null,
      render: false
    };
  },

  components: {
    gallery: VueGallery
  },
  mounted() {
    let datos = " ";
    imagesCertificates.on(
      "value",
      function(snapshot) {
        datos = snapshot.val();
        this.images=[];
       for (var key in datos){
          this.images.push(datos[key])
      }
      this.render = true;

      }.bind(this),
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
    //console.log(this.skills)
  }
};
</script>

<style scoped>
.image {
  float: left;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid #ebebeb;
  margin: 5px;
}
</style>