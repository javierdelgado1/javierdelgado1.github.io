<template>
  <div id="app">
    <Loader />
    <!-- BG Image -->
    <div class="bg-body bg-image zooming">
      <img src="https://javierdelgado.com.ve/apps/portfolio/src/assets/img/photos/bg_frontend.jpg" alt="" >
    </div>
    <Header />
    
    <!-- Content -->
    <div id="content" class="container">
      <div id="photo">
        <img src="https://javierdelgado.com.ve/apps/portfolio/src/assets/img/avatars/avatar.jpg" alt="">
      </div>
      <div id="sections-wrapper">
        <Home v-if="menu.home" :socials="socials"/>
        <About v-if="menu.about" />
        <Skill v-if="menu.skills"/>
        <PromoVideo v-if="menu.promoVideo"/>
        <Services v-if="menu.services" />
        <Pricing v-if="menu.princing"/>
        <Works v-if="menu.works" />
        <Experience v-if="menu.experience"/>
        <Reference v-if="menu.reference" />
        <LastestPost v-if="menu.lastestPost" />
        <Certificates v-if="menu.certificates" />
        <Contact  />
      </div>


    </div>
    <!-- Share -->
    <div id="share-it">
      <a href="#" class="icon icon-circle icon-share"><i class="fa fa-share-alt"></i></a>
      <ul class="share-list">
        <li v-for="(social, index) in socials" v-if="social.isVisible" :key="index">
          <a :href="social.url"  target="_blank" class="icon icon-circle" :class="social.class">
            <i :class="social.fa"></i>
          </a>
        </li>
      </ul>

    </div>

    <Others />

      <!-- Panel / End -->

    <!-- Ajax Modal -->
    <div id="ajax-modal">
          <project />
    </div>
    <!-- Ajax Loader -->
    <svg id="ajax-loader" class="loader" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="circle" fill="none" stroke-width="3" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg>

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
import Contact from './sections/Contact.vue'
import Others from './layouts/Others.vue'
import Project from './sections/Project.vue'
import {firebaseApp, query_menu, query_socials} from './firebaseApp'
import Certificates from './sections/Certificates.vue'





export default {
  name: 'app',
  data () {
    return {
      socials: [
                  /*{ url : 'https://twitter.com/cheche338', name: 'Twitter', class: 'icon-twitter', fa:'fa fa-twitter'  },
                  { url : 'https://www.facebook.com/04248309075j', name: 'Facebook', class: 'icon-facebook', fa:'fa fa-facebook'  },
                  { url : 'https://www.instagram.com/javierdelgado1/', name: 'Instagram', class: 'icon-instagram',  fa:'fa fa-instagram' },
                  { url : 'skype:cheche338?call', name: 'Skype', class: 'icon-skype', fa:'fa fa-skype'  },
                  { url : 'https://ve.linkedin.com/in/javierdelgado1', name: 'LinkedIn', class: 'icon-linkedin', fa:'fa fa-linkedin'  }*/

               ],
               menu: {}
    }
  },
  components:{
    Loader,
    Header,
    Home,
    About,
    Skill,
    PromoVideo,
    Services,
    Pricing,
    Works,
    Experience,
    Reference,
    LastestPost,
    Contact,
    Others,
    Project,
    Certificates

  },
  methods:{

  },
  created(){
    let lang =localStorage.getItem('vue-lang') 
    this.language =   lang=='es' || lang == 'en'?  lang : 'en'
        
  },
    mounted() {
        let datos=" ";
        query_menu.on("value", function(snapshot) {
            datos = snapshot.val()
            this.menu=datos
            console.log(this.menu)
        }.bind(this), function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });

        query_socials.on("value", function(snapshot) {
            datos = snapshot.val()
            this.socials=datos
            console.log(this.socials)
        }.bind(this), function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });

           
    }
}
</script>