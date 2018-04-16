<template>
	<!-- Section -->
		<section id="home" class="bg-white" data-target="local-scroll">
			<div class="section-content">
				<img class="img-circle mb-40 visible-sm visible-xs" src="https://javierdelgado.com.ve/apps/portfolio/src/assets/img/avatars/avatar_square_sm.jpg" alt="">
				<h1 class="mb-0" v-lang.hi></h1>
				<h3 class="text-muted">
					<!--<span class="typing" >
						{{home.subtitle_es}}
					</span>
					<span class="typing" v-else>
						{{home.subtitle_en}}
					</span>-->
					<vue-typer v-if="language=='es'" :text='home.subtitle_es'  ></vue-typer>
					<vue-typer v-else :text='home.subtitle_en' ></vue-typer>

				</h3>
				<hr class="sep-line">
				

				<div class="row">
					<div class="col-sm-4">
						<dl class="description-2">
							<dt v-lang.home.bornYear></dt>
							<dd>{{home.bornyear}}</dd>
							<dt v-lang.home.experience></dt>
							<dd>+{{home.experience}} years</dd>
						</dl>
					</div>
					<div class="col-sm-4">
						<dl class ="description-2">
							<dt v-lang.home.address></dt>
							<dd>{{home.address_es}}</dd>
							<dt v-lang.home.phone></dt>
							<dd>{{home.phone}}</dd>
						</dl>
					</div>
					<div class="col-sm-4">
						<dl class="description-2">
							<dt v-lang.home.email></dt>
							<dd><a href="#">{{home.email}}</a></dd>
							<dt v-lang.home.followme></dt>
							<dd >	
						          <a  v-for="(social, index) in socials" v-if="social.isVisible" :href="social.url"  target="_blank" class="icon icon-circle icon-sm" :class="social.class">
						            <i :class="social.fa"></i>
						          </a>
							</dd>
						</dl>
					</div>
				</div>
			</div>
			<a :href="home.url" class="btn btn-section btn-primary">
				<span class="i-before i" >
					<i :class="''+home.icon"></i>
					<i class="ti-arrow-down"></i>
					
				</span >
					<p v-if="language=='es'" v-html="home.label_es"></p>
					<p v-else v-html="home.label_en"></p>

			</a>
		</section>
</template>

<script >
	import {firebaseApp, perfil} from '../firebaseApp'
	export default{
		props: ['socials'],
			data () {
					return {
						  
							  home: {
							            bornyear:"",
							            address_es:"",
							            email:"",
							            experience:"",
							            phone:"",
							            web:"",
							            subtitle_es: "",
							            subtitle_en: "",
							            label_en:"",
							            label_es:"",
							            icon:"",
							            url:""

							        }
						}
			},
			mounted() {
			    let datos=" ";
			    perfil.on("value", function(snapshot) {
			      datos = snapshot.val()
			      	this.home.bornyear=datos.bornyear;
				    this.home.address_es=datos.address_es;
				    this.home.email=datos.email;
				    this.home.experience=datos.experience;
				    this.home.phone=datos.phone;
				    this.home.subtitle_es=datos.subtitle_es;
				    this.home.subtitle_en=datos.subtitle_en;
				    this.home.label_es=datos.label_es;
				    this.home.label_en=datos.label_en;
				    this.home.icon=datos.icon;
				    this.home.url=datos.url;

				   // console.log(this.home)
			      //console.log(snapshot.val())
			    }.bind(this), function (errorObject) {
			      console.log("The read failed: " + errorObject.code);
			    });
			    

			    
			},
			components:{
			}
	}
</script>