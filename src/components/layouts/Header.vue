<template>
		<!-- Header -->
	<header id="header" class="bg-primary">

		<!-- Top Bar -->
		<div id="top-bar">
			<div class="container">
				<nav class="menu module left">
					<a href="#" v-scroll-to="'#home'" class="active" v-lang.menu.home></a>
					<!--<a href="blog.html">Blog</a>
					<a href="documentation.html" target="_blank">Docs</a>-->
				</nav>
				<nav class="language menu module right">
					<span v-lang.menu.languajeVersion></span>
					<a  :class="{ 'active': lang=='en' }" @click="changeLanguage('en')" href="#" v-lang.menu.english></a>
					<a  :class="{ 'active': lang=='es' }" @click="changeLanguage('es')" href="#" v-lang.menu.spanish></a>
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
					<li v-if="menu.about"  >
						<a href="#" v-scroll-to="'#about'"  v-lang.menu.about></a>
					</li>
					<li v-if="menu.skills"  >
						<a href="#" v-scroll-to="'#skills'"  v-lang.menu.skills></a>
					</li>
					<li v-if="menu.works"  >
						<a href="#" v-scroll-to="'#works'"  v-lang.menu.works></a>
					</li>
					<li v-if="menu.experience"  >
						<a href="#" v-scroll-to="'#experience'"  v-lang.menu.experience></a>
					</li>
					<li v-if="menu.services"  >
						<a href="#" v-scroll-to="'#services'"  v-lang.menu.service></a>
					</li>
					<li v-if="menu.references">
						<a href="#" v-scroll-to="'#references'"  v-lang.menu.references></a>
					</li>
					<li v-if="menu.lastestPost" >
						<a href="#"  v-scroll-to="'#latest-posts'" v-lang.menu.lastestPost></a>
					</li>
					<li v-if="menu.certificates" >
						<a href="#" v-scroll-to="'#certificates'"  v-lang.menu.certificates></a>
					</li>
					<li v-if="menu.contact" >
						<a href="#" v-scroll-to="'#contact'"  v-lang.menu.contact></a>
					</li>
					<li class="icon-link">
						<a href="#" class="panel-toggle" data-toggle="panel"><span><span></span></span></a>
					</li>
				</ul>
			</nav>

			<div class="mobile-nav clearfix">
				<div class="owner">
					<img src="https://javierdelgado.com.ve/apps/portfolio/src/assets/img/avatars/avatar_square_sm.jpg" alt="">
					<span class="name" v-lang.myname></span>
				</div>
				<a href="#" class="panel-toggle" data-toggle="panel"><span><span></span></span></a>
			</div>
		</div>

	</header>
	<!-- Header / End -->
</template>

<script >
    import {firebaseApp, query_menu} from '../firebaseApp'
	export default {
		data(){
			return {
				lang:'en',
                menu: {}
			}
		},
		methods: {
			changeLanguage(lang){
				this.lang=lang
				this.language = lang
			}
		},
		created(){
   			 this.lang = this.language
   			 
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
	    }
	}
</script>