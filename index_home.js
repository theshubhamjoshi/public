var hos = document.getElementById("Hospital").value;


function Submitentry(hos) {
	
	var firebaseref = firebase.database().ref();

	firebaseref.child("Hospital").set("ho gya bhai");
}