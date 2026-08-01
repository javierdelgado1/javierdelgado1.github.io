<template>


	<!-- Panel -->
	<nav id="panel" class="bg-white">
		<div class="panel-wrapper">
			<!-- Photo -->
			<div class="photo">
				<img src="https://javierdelgado.com.ve/apps/portfolio/src/assets/img/avatars/avatar_square.jpg" alt="" width="310" v-bind:style="styleImg" >
			</div>

			<!-- Menu -->
			<div class="menu widget">
				<h6 v-lang.others.name></h6>
				<ul id="nav-mobile" class="nav nav-panel">
					<li v-if="menu.home" >
						<a href="#" v-scroll-to="'#home'"          v-lang.nav.home></a>
					</li>
					<li v-if="menu.about" >
						<a href="#" v-scroll-to="'#about'"         v-lang.nav.about></a>
					</li>
					<li v-if="menu.skills" >
						<a href="#" v-scroll-to="'#skills'"        v-lang.nav.skills></a>
					</li>
					<li v-if="menu.works" >
						<a href="#" v-scroll-to="'#works'"         v-lang.nav.works></a>
					</li>
					<li v-if="menu.experience" >
						<a href="#" v-scroll-to="'#experience'"    v-lang.nav.experience></a>
					</li>
					<li v-if="menu.references" >
						<a href="#" v-scroll-to="'#references'"    v-lang.nav.references></a>
					</li>
					<li v-if="menu.services" >
						<a href="#" v-scroll-to="'#services'"    v-lang.nav.service></a>
					</li>
					<li v-if="menu.lastestPost" >
						<a href="#" v-scroll-to="'#latest-posts'"  v-lang.nav.lastestPost></a>
					</li>
					<li v-if="menu.certificates" >
						<a href="#" v-scroll-to="'#certificates'"  v-lang.nav.certificates></a>
					</li>
				</ul>
			</div>
		</div>
	</nav>

	</template>

<script >
	import {query_menu} from '../data'

	export default{
		data(){
			return {
                menu: {},
				styleImg:{
					maxWidth: 'unset'
				}
			}
		},
	    mounted() {
	        this.menu = query_menu
	    }
	}
</script>