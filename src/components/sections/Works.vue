<template>
	<!-- Section -->
		<section id="works" class="bg-white">
			<div class="section-content clearfix">
				<h3 class="text-muted mb-0 pull-left" v-lang.menu.myworks></h3>
				<nav class="filter tabs-wrapper pull-right">
					<ul class="filter-isotope nav nav-tabs" data-filter-list="#works-list">
						<li class="active"><a href="#" data-filter="*">All</a></li>
						<li><a href="#" data-filter=".webdesign">Webdesign</a></li>
						<li><a href="#" data-filter=".development">Development</a></li>
					</ul>
					<span class="selector"></span>
				</nav>
			</div>

			<div class="images-list-wrapper" >
				 <div id="works-list" class="masonry images-list filter-list row no-padding" >
		            <div class="masonry-sizer col-md-4 col-sm-6 col-xs-12"></div>
		            <div class="masonry-item webdesign col-md-8 col-sm-6 col-xs-12">
		            	<div  v-for="(work, index ) in webdesigns2 " class="image-box image-hover bg-black text-center" @mouseover="mouseOver($event, work)">
							<div class="image">
								<img :src="work.cover_url" alt="">
							</div>
							<div class="hover">
								<a href="#">
									<h5 class="mb-0">The Bridge</h5>
									<span class="text-muted">Corporate Identity</span>
								</a>
								<a href="#" @click="openProject(2)" data-toggle="ajax-modal" class="btn btn-xs btn-white">Case Study <span class="i-after i"><i class="ti-desktop"></i><i class="ti-arrow-right"></i></span></a>
							</div>
						</div>
		            </div>
		            <div  id="development4" class="masonry-item development col-md-4 col-sm-6 col-xs-12">
						<div  v-for="(work, index ) in developments1 " class="image-box image-hover bg-black text-center" @mouseover="mouseOver($event, work)">
							<div class="image">
								<img :src="work.cover_url" alt="">
							</div>
							<div class="hover">
								<a href="#">
									<h5 class="mb-0">The Bridge</h5>
									<span class="text-muted">Corporate Identity</span>
								</a>
								<a href="#" @click="openProject(2)" data-toggle="ajax-modal" class="btn btn-xs btn-white">Case Study <span class="i-after i"><i class="ti-desktop"></i><i class="ti-arrow-right"></i></span></a>
							</div>
						</div>
						
		            </div>
		            <div class="masonry-item webdesign col-md-4 col-sm-6 col-xs-12">
		            	<div  v-for="(work, index ) in webdesigns1 " class="image-box image-hover bg-black text-center" @mouseover="mouseOver($event, work)">
							<div class="image">
								<img :src="work.cover_url" alt="">
							</div>
							<div class="hover">
								<a href="#">
									<h5 class="mb-0">The Bridge</h5>
									<span class="text-muted">Corporate Identity</span>
								</a>
								<a href="#" @click="openProject(2)" data-toggle="ajax-modal" class="btn btn-xs btn-white">Case Study <span class="i-after i"><i class="ti-desktop"></i><i class="ti-arrow-right"></i></span></a>
							</div>
						</div>
		            </div>
		            <div class="masonry-item corporate-identity col-md-4 col-sm-6 col-xs-12">

		            </div>
		            <div id="development8" class="masonry-item development col-md-8 col-sm-6 col-xs-12">
		              	<div  v-for="(work, index ) in developments2 " class="image-box image-hover bg-black text-center" @mouseover="mouseOver($event, work)">
							<div class="image">
								<img :src="work.cover_url" alt="">
							</div>
							<div class="hover">
								<a href="#">
									<h5 class="mb-0">The Bridge</h5>
									<span class="text-muted">Corporate Identity</span>
								</a>
								<a href="#" @click="openProject(2)" data-toggle="ajax-modal" class="btn btn-xs btn-white">Case Study <span class="i-after i"><i class="ti-desktop"></i><i class="ti-arrow-right"></i></span></a>
							</div>
						</div>
		            </div>
		          </div>
				<div class="images-list-hover">
					<div class="content">
						<!--<a     href="#" >
							<h5 class="mb-0">The Flower</h5>
							<span class="text-muted">Webdesign</span>
						</a>
						<button   @click="abrirproyecto(2)" >Case Study</button>-->
						  <a href="#">
		                    <h5 class="mb-0">{{title}}</h5>
		                    <span class="text-muted">{{category}}</span>
		                  </a>
		                  <button  @click="abrirproyecto()"   class="btn btn-xs btn-white">
		                  	<label v-lang.works.viewProject></label> 
		                  	<span class="i-after i">
		                  		<i class="ti-desktop"></i>
		                  		<i class="ti-arrow-right"></i>
		                  	</span>
		                  </button>
					</div>
				</div>
			</div>
		</section>

</template>



<script >
	import {firebaseApp, works} from '../firebaseApp'
	import {global, eventBus} from '../global'
	export default{
	  data() {
	  	return {
	  			works:[],
	  			bots: [],
	  			webdesigns1: [],
	  			webdesigns2: [],
	  			developments1: [],
	  			developments2: [],
	  			title: "",
	  			category: "",
	  			workCurrent:{}


	    }
	  },
	  methods: {
	       abrirproyecto(){
	       	//console.log("iniciando emision")
	       	eventBus.$emit('showProject', this.workCurrent);
	       //	console.log("terminando emision")

            var $ajaxLoader = $('#ajax-loader');
			var $ajaxModal = $('#ajax-modal');
            var $ajaxTmp = $('#ajax-tmp');
			$ajaxModal.show(0).addClass('loading-started');
			$ajaxLoader.fadeIn(200).css('display','inline-block');
			setTimeout(function(){
				$('html').addClass('locked-scrolling');
				$ajaxModal.children('.ajax-modal-wrapper').show(0);

				$ajaxModal.addClass('loading-finished');
				$ajaxLoader.fadeOut(400);
			},800);


	      },
	      mouseOver(event, work){
				let element = event.path[2];
				let container = $('.images-list'),

				$hover = event.path[5].childNodes[2];
				let content = $('.content'),
				$self = element,
				x = event.path[2].firstElementChild.firstChild.x - container.offset().left  - 10,
				y = event.path[2].firstElementChild.firstChild.y - container.offset().top - 10,
				width = event.path[2].clientWidth  + 20,
				height = event.path[2].clientHeight + 20;

				$('.images-list-hover').css({
                        'left': x + 'px',
                        'top': y + 'px',
                        'width': width + 'px',
                        'height': height + 'px'
                });
                
				//console.log(work)
				this.title=work.name
				this.category=work.category
				this.workCurrent=work
				//console.log(x,y,width,height);
	      	}
	      },
	      mounted() {
		    let datos=[];
		    let works_webdesign= firebaseApp.database().ref().child('works').orderByChild("category").equalTo("webdesign")
		    let works_development= firebaseApp.database().ref().child('works').orderByChild("category").equalTo("development")
		    let works_bots= firebaseApp.database().ref().child('works').orderByChild("category").equalTo("bots")


		    works_webdesign.on("value", function(snapshot) {
		      datos = snapshot.val()
		      console.log(datos)
		     this.webdesigns=datos
  		     this.webdesigns1=[];
		     this.webdesigns2=[];

		      let i=0
		      if (datos != null){
			      if(datos.length==1 ||  datos.length==0){
			      	this.webdesigns1=datos
			      }
			      else{	
			      	  while(i++<(datos.length/2))
				    	  this.webdesigns1.push(datos[i-1])
			      	  i=(datos.length/2)-1
		      		  while(i++<(datos.length-1))
				      	  this.webdesigns2.push(datos[i])
			      }
		      }


		    }.bind(this), function (errorObject) {
		      console.log("The read failed: " + errorObject.code);
		    });

		    works_development.on("value", function(snapshot) {
		      datos = []
		      snapshot.forEach(event => {
		        datos.push(event.val())
		      })
		     this.developments1=[];
		     this.developments2=[];

		      let i=0
		      if(datos.length==1 ||  datos.length==0){
		      	this.developments1=datos
		      }
		      else{	
		      	  while(i++<(datos.length/2))
			    	  this.developments1.push(datos[i-1])
		      	  i=(datos.length/2)-1
	      		  while(i++<(datos.length-1))
			      	  this.developments2.push(datos[i])
		      }
              $('#works-list').attr('style', 'position: relative; height: 500px;')

		    }.bind(this), function (errorObject) {
		      console.log("The read failed: " + errorObject.code);
		    });



		    works_bots.on("value", function(snapshot) {
		      datos = snapshot.val()
		      //console.log(datos)
		      this.bots=datos
		    }.bind(this), function (errorObject) {
		      console.log("The read failed: " + errorObject.code);
		    });



		    var $grid = $('.masonry','#content');

            $grid.masonry({
                columnWidth: '.masonry-sizer',
                itemSelector: '.masonry-item',
                percentPosition: true
            });

            $grid.imagesLoaded().progress(function() {
                $grid.masonry('layout');
            });

            $grid.on('layoutComplete', Waypoint.refreshAll())
           /* var development4 = document.getElementById('development4').clientHeight;
            var development8 = document.getElementById('development8').clientHeight;
            console.log(development4)
            console.log(development8)*/




		     /* console.log(this.webdesigns)
		      console.log(this.developments1)
		      console.log(this.developments2)

		      console.log(this.bots)*/


		}/*,
		computed:{
			developments(){	

				return developments;
			},
			webdesigns(){

				return webdesigns;
			},
			bots(){

				return bots;
			}
		}*/
	}


</script>




