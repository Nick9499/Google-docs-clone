import firebase from "firebase"

const firebaseConfig = {
	apiKey: "AIzaSyA2AoIpunVa5FtwZ0nJajVU7xw40HP-LU4",
	authDomain: "docsclone-f84dd.firebaseapp.com",
	projectId: "docsclone-f84dd",
	storageBucket: "docsclone-f84dd.appspot.com",
	messagingSenderId: "166849181246",
	appId: "1:166849181246:web:a522bafe890ab3802e436f",
}

const app = !firebase.apps.length
	? firebase.initializeApp(firebaseConfig)
	: firebase.app()

const db = app.firestore()

export { db }
