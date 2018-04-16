<template>
	<div class="ajax-modal-wrapper">
		<div class="ajax-title-bar">
			<div class="container">
				<span class="title">{{work.name}}</span>
				<a href="#" class="ajax-close icon icon-circle icon-secondary" data-dismiss="ajax-modal"><i class="ti-close"></i></a>
			</div>
		</div>
	<div class="ajax-content">
		<div class="container">
			<div class="row">
				<div class="col-md-6">
					<carousel :per-page="1" class="animated bounceInLeft appear-animation-visible" data-appear-animation="bounceInLeft" data-appear-animation-delay="800" style="animation-delay: 800ms;">
					    <slide v-for="(img, index) in work.screenshots">
							<img :src="img" alt="">
					    </slide>
  					</carousel>												
					<hr class="tall">
					<ul >
						<li>
							<p v-lang.works.tecnologiesUsed></p>
							<ul class="list list-skills icons list-unstyled list-inline" >
								<li v-for="(tecnologies, index) in work.tecnologies"><i class="fa fa-check-circle"></i> {{tecnologies}}</li>
							</ul>
						</li>								
					</ul>

					<!--<p v-lang.works.tecnologiesUsed></p>
					<ul class="list list-skills icons list-unstyled list-inline" >
						<li v-for="(tecnologies, index) in work.tecnologies"><i class="fa fa-check-circle"></i> {{tecnologies}}</li>
					</ul>-->
				</div>
				<div class="col-md-6">
					 <section  class="animated bounceIn appear-animation-visible" data-appear-animation="bounceIn" data-appear-animation-delay="800" style="animation-delay: 800ms;">
					
							<h4 v-lang.works.description>							
							</h4>
							<div v-if="language=='es'">
								<p class="taller" >
									{{work.description_es}}
								</p>
							</div>
							<div v-else>
								<p class="taller" >
									{{work.description_en}}
								</p>
							</div>
							
							
					</section>
					<div  v-if="work.hasDetail==true || work.hasDetail=='true'">
							<h4 v-lang.works.details>
							</h4>
							<p class="taller"></p>
							<ul v-if="language=='es'">
								<li    v-for="(detail, index) in work.details_es">{{detail}}</li>
		                    </ul>
		                    <ul v-else>
								<li    v-for="(detail2, index) in work.details_en">{{detail2}}</li>
		                    </ul>
		                    <p></p>
					</div>
					<div class="row">
						<div class="col-md-6">
						</div>
						<template class="col-md-6" >
							<a :href="work.urlProject" target="_blank" class="btn btn-primary btn-icon">
								<i class="fa fa-external-link"></i>
								<label v-lang.works.viewDemo></label>
							</a> 
							<span class="arrow hlb appear-animation rotateInUpLeft appear-animation-visible animated" data-appear-animation="rotateInUpLeft" data-appear-animation-delay="900" style="animation-delay: 900ms;" ></span>
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

</template>
<script >
	import {global, eventBus} from '../global'
	import { Carousel, Slide } from 'vue-carousel';
	export default{
		data(){
			return {
				work: []
			}
		},
		created(){
			eventBus.$on('showProject', function (work) {
	            console.log(work)
	            this.work=work
	        }.bind(this));
	        let lang =localStorage.getItem('vue-lang') 
    		this.language =   lang=='es' || lang == 'en'?  lang : 'en'

		}
	}
</script>