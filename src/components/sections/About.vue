<template>
	<!-- Section -->
		<section id="about" class="bg-white">
			<div class="section-content">
				<h3 class="text-muted" v-lang.menu.about></h3>
				<p class="lead text-lg mb-0" >
					<div v-if="language=='es'" v-html="about.description_es">
					</div>
					<div v-else v-html="about.description_en">
					</div>
					
				</p>
			</div>
		</section>
</template>

<script >
	import {about} from '../data'

	export default{
		data () {
					return {
						  
							  about: {
							            description_es:"",
							            description_en:""
							        }
						}
			},
			mounted() {
			    const datos = about;
			    this.about.description_es=datos.description_es;
			    this.about.description_en=datos.description_en;
			}
	}
</script>