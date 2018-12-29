import Vue from 'vue'
import App from './components/App.vue'

import MultiLanguage from 'vue-multilanguage'
import VueScrollTo  from 'vue-scrollto'

import  VueFire  from 'vuefire'
import  firebase  from 'firebase'
import { VueTyper } from 'vue-typer'
import VueCarousel from 'vue-carousel';

var VueTyperPlugin = require('vue-typer').default

Vue.use(VueFire)
Vue.use(VueScrollTo)
Vue.use(VueScrollTo, {
     container: "body",
     duration: 500,
     easing: "ease",
     offset: 0,
     cancelable: true,
     onStart: false,
     onDone: false,
     onCancel: false,
     x: false,
     y: true
})


Vue.use(MultiLanguage, {
	default: 'en',
	en: {
		myname:'Ing. Javier Delgado',
		hi: "I'm Javier",
		type: "Proffesional Web developer full stack",
		menu: {
			home: 'home',
			about: 'About',
			skills: 'Skills',
			works: 'Works',
			experience: 'Experience &amp; jobs',
			references: 'References',
			lastestPost: 'Lastest Post',
			contact: 'Contact',
			languajeVersion: 'LANGUAGE VERSION',
			english: 'English',
			spanish: 'Spanish',
			service: 'My services',
			certificates: 'Certificates'
		},
		home: {
			  bornYear: "Born year: ",
			  address: 'Address: ',
			  email : 'E-mail: ',
			  checkMy:'Download my <strong>CV</strong> ',
			  works: 'works',
			  followme: 'Follow me!',
			  phone: 'Phone: ',
			  experience: 'Experiencie: '
			},
		about : {
			description: "Hola soy Javier Delgado Ingeniero en Computación, me apasiona todo lo que está relacionado con la tecnológia, ciencias computacionales, desarrollo de aplicaciones de entorno web, sistemas, páginas web, bases de datos, seguridad informática, posicionamiento en buscadores, tecnológia, internet, robótica y electrónica.  Siempre he sentido el gran interés por la tecnológia y en especial por las computadoras y las relacionadas a estas, esto me dio el deseo de querer saber de cómo funcionan las tecnologías y de saber cómo se pueden desarrollar, sabiendo que esto es el futuro, por lo que decidí estudiar Ing. En Computación de la cual soy egresado de la Universidad de Oriente Nucleo Anzoategui, Barcelona Edo. Anzoátegui Venezuela.						 Gracias a mis estudios y experiencias laborales tengo una gran amplia variedad de conocimientos en el área de programación y de robótica (todo descrito en detalle más abajo) Actualmente hablo español, mi lengua nativa, lenguaje gestual (lenguaje de señas) además manejo ingles intermedio con total habilidad para leer y escribir (actualmente estoy en proceso de aprendizaje). Tengo experiencia laboral en desarrollo de aplicaciones web, desktop (java) así como también en la creación y mantenimiento de sitios web."
			 
		},
		nav:{
			home: ' <i class="ti-home"></i> home',
			about: '<i class="ti-comment-alt"></i> About',
			skills: '<i class="ti-stats-up"></i>Skills',
			works: '<i class="ti-heart"></i>Works',
			experience: '<i class="ti-time"></i>Experience',
			references: '<i class="ti-file"></i>References',
			lastestPost: '<i class="ti-comments"></i>Lastest Post',
			contact: '<i class="ti-mobile"></i>Contact',
			certificates: '<i class="ti-heart"></i>Certificates',
			service: '<i class="ti-file"></i>Services',

		},
		others: {
			name:'Navegation',
			title_form: 'Contact me',
			input_name:'Name',
			input_email:'E-mail',
			input_message:'Message'

		},
		contact:{
			address: 'Address',
			email: 'E-mail',
			phone: 'Phone',
			button_send_message:'<span>Send Message</span>',
			input_name:'Name',
			input_email:'E-mail',
			input_message:'Message'
		},
		works:{
			viewProject: "Case Study",
			description: "Project <strong>description</strong>",
			tecnologiesUsed: "<strong>Technology used:</strong>",
			viewDemo: "Live Demo ",
			details: "<strong>Details</strong>  of the project "
		}
		
	},
	es: {
		myname:'Ing. Javier Delgado',
		hi: 'Hola soy Javier',
		type: "Ing. en Computacion, profesional en el desarrollo web",
		menu: {
			home: 'Inicio',
			about: 'Sobre mi',
			skills: 'Habilidades',
			works: 'Mis trabajos',
			experience: 'Experiencia &amp;  trabajos',
			references: 'Referencias',
			lastestPost: 'Ultimas publicaciones',
			contact: 'Contacto',
			languajeVersion: 'IDIOMA',
			english: 'Ingles',
			spanish: 'Español',
			service: 'Mis servicios',
			certificates: 'Certificados'
		},
		home: {
		  bornYear: "Fecha de nacimiento: ",
		  address: 'Direccion:',
		  email : 'Correo:',
		  checkMy:'Descarga mi <strong>curriculum</strong>',
		  works: ' trabajos',
		  followme: '¡Sigueme!',
		  phone: 'telefono: ',
		  experience: 'Experiencie: '
		},
		about : {
			description: "Hola soy Javier Delgado Ingeniero en Computación, me apasiona todo lo que está relacionado con la tecnológia, ciencias computacionales, desarrollo de aplicaciones de entorno web, sistemas, páginas web, bases de datos, seguridad informática, posicionamiento en buscadores, tecnológia, internet, robótica y electrónica.  Siempre he sentido el gran interés por la tecnológia y en especial por las computadoras y las relacionadas a estas, esto me dio el deseo de querer saber de cómo funcionan las tecnologías y de saber cómo se pueden desarrollar, sabiendo que esto es el futuro, por lo que decidí estudiar Ing. En Computación de la cual soy egresado de la Universidad de Oriente Nucleo Anzoategui, Barcelona Edo. Anzoátegui Venezuela.						 Gracias a mis estudios y experiencias laborales tengo una gran amplia variedad de conocimientos en el área de programación y de robótica (todo descrito en detalle más abajo) Actualmente hablo español, mi lengua nativa, lenguaje gestual (lenguaje de señas) además manejo ingles intermedio con total habilidad para leer y escribir (actualmente estoy en proceso de aprendizaje). Tengo experiencia laboral en desarrollo de aplicaciones web, desktop (java) así como también en la creación y mantenimiento de sitios web."
		},
		nav:{
			home: '<i class="ti-home"></i>Inicio',
			about: '<i class="ti-comment-alt"></i>Sobre mi',
			skills: '<i class="ti-stats-up"></i>Habilidades',
			works: '<i class="ti-heart"></i>Mis trabajos',
			experience: '<i class="ti-time"></i>Experiencia',
			references: '<i class="ti-file"></i>Referencias',
			service: '<i class="ti-file"></i>Servicios',
			lastestPost: '<i class="ti-comments"></i>Ultimas publicaciones',
			contact: '<i class="ti-mobile"></i>Contacto',
			certificates: '<i class="ti-heart"></i>Certificados'
		},
		others: {
			name:'Navegacion',
			title_form: 'Contactame',
			input_name:'Nombre',
			input_email:'Correo',
			input_message:'Mensaje'

		},
		contact:{
			address: 'Direccion',
			email: 'Correo',
			phone: 'Telefono',
			button_send_message:'<span>Enviar Mensaje</span>',
			input_name:'Nombre',
			input_email:'Correo',
			input_message:'Mensaje'
		},
		works:{
			viewProject: "Ver Proyecto",
			description: "<strong>Descripción</strong>  del proyecto",
			tecnologiesUsed: "<strong>Tecnología usada:</strong>",
			viewDemo: "Ver Demo ",
			details: "<strong>Detalles</strong>  del proyecto"
		}
		
	}
	
})
Vue.use(VueTyperPlugin)
Vue.use(VueCarousel);

new Vue({
  el: '#app',
  render: h => h(App)
})
