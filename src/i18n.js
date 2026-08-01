import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    myname: 'Ing. Javier Delgado',
    hi: "I'm Javier",
    type: 'Proffesional Web developer full stack',
    menu: {
      home: 'home',
      about: 'About',
      skills: 'Skills',
      works: 'Works',
      experience: 'Experience &amp; jobs',
      references: 'References',
      lastestPost: 'Lastest Post',
      languajeVersion: 'LANGUAGE VERSION',
      english: 'English',
      spanish: 'Spanish',
      service: 'My services',
      certificates: 'Certificates'
    },
    home: {
      bornYear: 'Born year: ',
      address: 'Address: ',
      email: 'E-mail: ',
      checkMy: 'Download my <strong>CV</strong> ',
      works: 'works',
      followme: 'Follow me!',
      phone: 'Phone: ',
      experience: 'Experiencie: '
    },
    about: {
      description: "Hola soy Javier Delgado Ingeniero en Computación, me apasiona todo lo que está relacionado con la tecnológia, ciencias computacionales, desarrollo de aplicaciones de entorno web, sistemas, páginas web, bases de datos, seguridad informática, posicionamiento en buscadores, tecnológia, internet, robótica y electrónica.  Siempre he sentido el gran interés por la tecnológia y en especial por las computadoras y las relacionadas a estas, esto me dio el deseo de querer saber de cómo funcionan las tecnologías y de saber cómo se pueden desarrollar, sabiendo que esto es el futuro, por lo que decidí estudiar Ing. En Computación de la cual soy egresado de la Universidad de Oriente Nucleo Anzoategui, Barcelona Edo. Anzoátegui Venezuela. Gracias a mis estudios y experiencias laborales tengo una gran amplia variedad de conocimientos en el área de programación y de robótica (todo descrito en detalle más abajo) Actualmente hablo español, mi lengua nativa, lenguaje gestual (lenguaje de señas) además manejo ingles intermedio con total habilidad para leer y escribir (actualmente estoy en proceso de aprendizaje). Tengo experiencia laboral en desarrollo de aplicaciones web, desktop (java) así como también en la creación y mantenimiento de sitios web."
    },
    nav: {
      home: ' <i class="ti-home"></i> home',
      about: '<i class="ti-comment-alt"></i> About',
      skills: '<i class="ti-stats-up"></i>Skills',
      works: '<i class="ti-heart"></i>Works',
      experience: '<i class="ti-time"></i>Experience',
      references: '<i class="ti-file"></i>References',
      lastestPost: '<i class="ti-comments"></i>Lastest Post',
      certificates: '<i class="ti-heart"></i>Certificates',
      service: '<i class="ti-file"></i>Services'
    },
    others: {
      name: 'Navegation'
    },
    works: {
      viewProject: 'Case Study',
      description: 'Project <strong>description</strong>',
      tecnologiesUsed: '<strong>Technology used:</strong>',
      viewDemo: 'Live Demo ',
      details: '<strong>Details</strong>  of the project '
    }
  },
  es: {
    myname: 'Ing. Javier Delgado',
    hi: 'Hola soy Javier',
    type: 'Ing. en Computacion, profesional en el desarrollo web',
    menu: {
      home: 'Inicio',
      about: 'Sobre mi',
      skills: 'Habilidades',
      works: 'Mis trabajos',
      experience: 'Experiencia &amp;  trabajos',
      references: 'Referencias',
      lastestPost: 'Ultimas publicaciones',
      languajeVersion: 'IDIOMA',
      english: 'Ingles',
      spanish: 'Español',
      service: 'Mis servicios',
      certificates: 'Certificados'
    },
    home: {
      bornYear: 'Fecha de nacimiento: ',
      address: 'Direccion:',
      email: 'Correo:',
      checkMy: 'Descarga mi <strong>curriculum</strong>',
      works: ' trabajos',
      followme: '¡Sigueme!',
      phone: 'telefono: ',
      experience: 'Experiencie: '
    },
    about: {
      description: "Hola soy Javier Delgado Ingeniero en Computación, me apasiona todo lo que está relacionado con la tecnológia, ciencias computacionales, desarrollo de aplicaciones de entorno web, sistemas, páginas web, bases de datos, seguridad informática, posicionamiento en buscadores, tecnológia, internet, robótica y electrónica.  Siempre he sentido el gran interés por la tecnológia y en especial por las computadoras y las relacionadas a estas, esto me dio el deseo de querer saber de cómo funcionan las tecnologías y de saber cómo se pueden desarrollar, sabiendo que esto es el futuro, por lo que decidí estudiar Ing. En Computación de la cual soy egresado de la Universidad de Oriente Nucleo Anzoategui, Barcelona Edo. Anzoátegui Venezuela. Gracias a mis estudios y experiencias laborales tengo una gran amplia variedad de conocimientos en el área de programación y de robótica (todo descrito en detalle más abajo) Actualmente hablo español, mi lengua nativa, lenguaje gestual (lenguaje de señas) además manejo ingles intermedio con total habilidad para leer y escribir (actualmente estoy en proceso de aprendizaje). Tengo experiencia laboral en desarrollo de aplicaciones web, desktop (java) así como también en la creación y mantenimiento de sitios web."
    },
    nav: {
      home: '<i class="ti-home"></i>Inicio',
      about: '<i class="ti-comment-alt"></i>Sobre mi',
      skills: '<i class="ti-stats-up"></i>Habilidades',
      works: '<i class="ti-heart"></i>Mis trabajos',
      experience: '<i class="ti-time"></i>Experiencia',
      references: '<i class="ti-file"></i>Referencias',
      service: '<i class="ti-file"></i>Servicios',
      lastestPost: '<i class="ti-comments"></i>Ultimas publicaciones',
      certificates: '<i class="ti-heart"></i>Certificados'
    },
    others: {
      name: 'Navegacion'
    },
    works: {
      viewProject: 'Ver Proyecto',
      description: '<strong>Descripción</strong>  del proyecto',
      tecnologiesUsed: '<strong>Tecnología usada:</strong>',
      viewDemo: 'Ver Demo ',
      details: '<strong>Detalles</strong>  del proyecto'
    }
  }
}

const stored = localStorage.getItem('vue-lang')
const locale = stored === 'es' || stored === 'en' ? stored : 'en'

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale,
  fallbackLocale: 'en',
  messages
})

export default i18n