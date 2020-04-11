firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	window.location.href = "someOtherFile.html";
  	window.alert("I am in if section");
  } else {
    window.alert("I am in else section");
    window.location.href = "someOtherFile.html";
  }
});


function login() {

	var username = document.getElementById("user_name").value;
	var pass = document.getElementById("pass_word").value;

	firebase.auth().signInWithEmailAndPassword(username, pass).catch(function(error) {
  		var errorCode = error.code;
  		var errorMessage = error.message;
  		window.alert("hii");
  		window.alert("Error : " errorMessage);
  	});
}
