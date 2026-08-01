<template>
		<!-- Section -->
		<section id="skills" class="bg-white">
			<div class="section-content">
				<h3 class="text-muted" v-lang.menu.skills></h3>

				<div  v-for="(skill, index) in skills">
					<h5 class="mb-5">{{skill.name}}</h5>
					<div class="progress">
						<div class="progress-bar" role="progressbar" :style="'width: '+ skill.value+ '%'">{{skill.value}}%</div>
					</div>
				</div>
			</div>
		</section>
	
</template>

<script >
	import {skills} from '../data'

	export default{
		data(){
			return			{
				skills: [],
				render:false
				
			}
		},
		mounted() {
			    this.skills = skills
			    this.render = true
			}
		
	}
</script>
