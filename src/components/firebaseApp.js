import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBpOAsb8DDBsmtXv1BsnbnpDbynTHi70nI",
    authDomain: "portafolio-5fd2c.firebaseapp.com",
    databaseURL: "https://portafolio-5fd2c.firebaseio.com",
    projectId: "portafolio-5fd2c",
    storageBucket: "portafolio-5fd2c.appspot.com",
    messagingSenderId: "124037742441"
  };


export const firebaseApp = firebase.initializeApp(config)
export const perfil = firebaseApp.database().ref().child('home')
export const about = firebaseApp.database().ref().child('about')
export const skills = firebaseApp.database().ref().child('skills')
export const works = firebaseApp.database().ref().child('works')
export const contact = firebaseApp.database().ref().child('contact')
export const query_services = firebaseApp.database().ref().child('services')
export const query_experience = firebaseApp.database().ref().child('experience')
export const query_menu = firebaseApp.database().ref().child('menu')
export const query_socials = firebaseApp.database().ref().child('socials')









