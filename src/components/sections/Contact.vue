<template>
	<!-- Section -->
		<section id="contact" class="bg-white">
			<div class="section-content">
				<h3 class="text-muted" v-lang.menu.contact></h3>
				<div class="row">
					<div class="col-sm-6">
						<!-- Icon Box -->
						<div class="icon-box icon-box-2">
							<span class="icon icon-sm icon-circle icon-primary"><i class="fa fa-map-marker"></i></span>
							<div class="icon-box-content">
								<h6 class="text-muted" v-lang.contact.address></h6>
								<address class="text-md mb-0">
								{{contact.address}}
								</address>
							</div>
						</div>
						<!-- Icon Box -->
						<div class="icon-box icon-box-2">
							<span class="icon icon-sm icon-circle icon-primary"><i class="fa fa-envelope"></i></span>
							<div class="icon-box-content">
								<h6 class="text-muted" v-lang.contact.email></h6>
								<a href="#" class="link-underline text-md">{{contact.email}}</a>
							</div>
						</div>
						<!-- Icon Box -->
						<div class="icon-box icon-box-2">
							<span class="icon icon-sm icon-circle icon-primary"><i class="fa fa-phone"></i></span>
							<div class="icon-box-content">
								<h6 class="text-muted" v-lang.contact.phone></h6>
								<a href="#" class="text-md">{{contact.phone}}</a>
							</div>
						</div>
					</div>
					<div class="col-sm-6">
						<form @submit.prevent="onContact"  id="contactForm" class="contact-form validate-form">
							<!--<div id="#notification-bar">
								<div class='alert alert-success'>Se ha enviado correctamente<a href="#" class="close-it"><i class="ti-close"></i></a></div>
							</div>-->
							<div class="form-group input-wrapper">
								<input name="name" type="text"  v-model="name" class="form-control" required>
								<span class="input-label" v-lang.contact.input_name></span>
							</div>
							<div class="form-group input-wrapper">
								<input name="email" type="email" v-model="email" class="form-control" required>
								<span class="input-label" v-lang.contact.input_email></span>
							</div>
							<div class="form-group input-wrapper">
								<textarea name="message" cols="30" v-model="text" rows="4" class="form-control"></textarea>
								<span class="input-label" v-lang.contact.input_message></span>
								<span class="input-line"></span>
							</div>
							<div class="row">
								<div class="col-sm-8 col-sm-push-2">
									<button type="submit" :class="buttonClass" v-lang.contact.button_send_message></button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div id="google-map" class="h-300" data-latitude="10.2094606" data-longitude="-64.6331302"></div>
		</section>
</template>

<script >
	import {firebaseApp, contact} from '../firebaseApp'
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
				email: "" 
			}
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
			                        message: {
			                        	required: true
			                        }

			                    }
			                });
			            }); 
			            var $form=$('#contactForm')
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
		},
		mounted() {
			    let datos=" ";
			    contact.on("value", function(snapshot) {
			      datos = snapshot.val()
				    this.contact.address=datos.address;
				    this.contact.email=datos.email;
				    this.contact.phone=datos.phone;
				   // console.log(this.home)
			      //console.log(snapshot.val())
			    }.bind(this), function (errorObject) {
			      console.log("The read failed: " + errorObject.code);
			    });
		}

	}
</script>