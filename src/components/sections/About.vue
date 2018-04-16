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
	import {firebaseApp, about} from '../firebaseApp'

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
			    let datos=" ";
			    about.on("value", function(snapshot) {
			        datos = snapshot.val()
			      	this.about.description_es=datos.description_es;
				    this.about.description_en=datos.description_en;
			    }.bind(this), function (errorObject) {
			      console.log("The read failed: " + errorObject.code);
			    });
			}
	}
</script>