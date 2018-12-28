<template>


	<!-- Panel -->
	<nav id="panel" class="bg-white">
		<div class="panel-wrapper">
			<!-- Photo -->
			<div class="photo">
				<img src="https://javierdelgado.com.ve/apps/portfolio/src/assets/img/avatars/avatar_square.jpg" alt="">
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
					<li v-if="menu.service" >
						<a href="#" v-scroll-to="'#references'"    v-lang.nav.service></a>
					</li>
					<li v-if="menu.lastestPost" >
						<a href="#" v-scroll-to="'#latest-posts'"  v-lang.nav.lastestPost></a>
					</li>
					<li v-if="menu.certificates" >
						<a href="#" v-scroll-to="'#certificates'"  v-lang.nav.certificates></a>
					</li>
					<li v-if="menu.contact" >
						<a href="#" v-scroll-to="'#contact'"       v-lang.nav.contact></a>
					</li>
				</ul>
			</div>

			<!-- Contact -->
			<div class="latest-posts widget">
				<h6 v-lang.others.title_form></h6>
				<form @submit.prevent="onContact" id="contactForm2" class="contact-form validate-form">
					<div class="form-group input-wrapper">
						<input type="text" class="form-control" v-model="name"  required>
						<span class="input-label" v-lang.others.input_name></span>
					</div>
					<div class="form-group input-wrapper">
						<input type="email" class="form-control" v-model="email" required>
						<span class="input-label" v-lang.others.input_email></span>
					</div>
					<div class="form-group input-wrapper">
						<textarea name="messageArea" cols="30" rows="4" v-model="text" class="form-control"></textarea >
						<span class="input-label" v-lang.others.input_message></span>
						<span class="input-line"></span>
					</div>
					<div class="row">
						<div class="col-sm-8 col-sm-push-2">
							<button type="submit" class="btn btn-submit" :class="buttonClass"  v-lang.contact.button_send_message ></button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</nav>

	</template>

<script >
	import {firebaseApp, contact, query_menu} from '../firebaseApp'
	import {global_url} from '../global'

	export default{	
		data(){
			return {
				contact: {
					address: "",
					email:"",
					phone:""
				},
				buttonClass: "btn btn-submit",
				draft:"btn btn-submit",
				name: "",
				text: "",
				email: "" ,
                menu: {}

			}
		},
	    mounted() {
	        let datos=" ";
	        query_menu.on("value", function(snapshot) {
	            datos = snapshot.val()
	            this.menu=datos
	            //console.log(this.menu)
	        }.bind(this), function (errorObject) {
	          console.log("The read failed: " + errorObject.code);
	        });
	    },
		methods:{
			onContact(){
		            	/* Validate Form */
			            $('.validate-form').each(function(){
			                $(this).validate({
			                    validClass: 'valid',
			                    errorClass: 'error',
			                    onfocusout: function(element,event) {
			                        $(element).valid();
			                    },
			                    errorPlacement: function(error,element) {
			                        return true;
			                    },
			                    rules: {
			                        email: {
			                            required    : true,
			                            email       : true
			                        },
			                        name:{
			                        	require: true
			                        },
			                        messageArea: {
			                        	required: true
			                        }

			                    }
			                });
			            }); 
			            var $form=$('#contactForm2')
		              	if ($form.valid()){
							this.buttonClass= this.buttonClass + ' loading'	
							let formData =new FormData();
							formData.append('name', this.name)
							formData.append('email', this.email)
							formData.append('text', this.text)
							fetch(global_url.url_contact, {
								method: 'post',
								body: formData
							}).then(function(response) {
								debugger;
								if(response.status==200||response.status =="200"){
								    	this.buttonClass='btn btn-submit  success loading'
								    	this.name=""
								    	this.email=""
								    	this.text=""

								}
							}.bind(this)).then(function(data) {
								
									//this.buttonClass='btn btn-submit'    

							}.bind(this));
						}
					    

			}
		}

	}
</script>