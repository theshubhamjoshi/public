var blood1 = new Array();
var treatment1 = new Array();
var facilities1 = new Array();
var flag = 0;

var mail = "";
var state1 = "";
var city1 = "";
var treatment = "";
var facilities = "";


var counter=0;


function signUp () {
  // body... 


  var hospital = document.getElementById('hospital_name').value;
  mail = document.getElementById('email').value;
  var pass = document.getElementById('password').value;
  var pass1 = document.getElementById('cpassword').value;

  state1 = document.getElementById("state").value;
  city1 = document.getElementById("city").value;

  state1 = state1.toLowerCase().charAt(0).toUpperCase() + state1.toLowerCase().slice(1);
  city1 = city1.toLowerCase().charAt(0).toUpperCase() + city1.toLowerCase().slice(1);
  if (pass != pass1){
    alert("Passwords Mismatch.")
    return;
  }
  firebase.auth().createUserWithEmailAndPassword(mail, pass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    
  }).then(function(){
    localStorage.setItem("hospitalName", hospital);
    flag = 1;

    

    
  });

  
}


function login () {
  // body... 
  var email = document.getElementById("user_name").value;
  var password = document.getElementById("pass_word").value;

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  alert(errorMessage);
  // ...
  });

  checkLogin();
}




function checkLogin () {
  // body... 

  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    if (flag == 1){
      if (city1.split(" ").length>1){
        temp = city1.split(" ");
        city1 = temp[temp.length-1].toLowerCase();
      }

      user.updateProfile({displayName: localStorage.getItem("hospitalName")}).then(function(){
                           
                            
                        });

      firebase.database().ref("/hospitalLogins/"+mail.split(".")[0]).update({
      state : state1,
      city : city1,
      name : localStorage.getItem("hospitalName")



    }).then(function(){
      window.location.replace("home.html");
    });
    }else {

      window.location.replace("home.html");
      
    }
    
    // ...
  } else {
    // User is signed out.
    // ...
  }
});
}


function getLogin () {
  // body... 

  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
   
    document.getElementById('username').innerHTML = user.email;
    localStorage.setItem("email", user.email);
    localStorage.setItem("hospitalName", user.displayName);
    document.getElementById("hospital_name").value= user.displayName;
    loadData(user.displayName,user.email);
    firebase.database().ref("/verifyRequests/"+localStorage.getItem("state")+"/"+localStorage.getItem("city")+"/"+localStorage.getItem("hospitalName")).once('value').then(function(snapshot){
      if(snapshot.val().verified == "pending"){
        document.getElementById("verify").innerHTML = "Verification Pending";
      }
    })
  } else {
    // No user is signed in.
  }
});
}

function getLogin1() {
  // body... 

  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var name = localStorage.getItem("hospitalName").split(" ");
    var name1 = ""
    for (i=0; i<name.length;i++){
      if (i!=name.length-1){
        name1 += name[i]+","
      }else {
        name1 += name[i]
      }
    }
    var email = localStorage.getItem("email");
    var state = localStorage.getItem("state");
    var city = localStorage.getItem("city");
    document.getElementById('username').innerHTML = user.email;
    document.getElementById("qrcode").src = "https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=https://amritha-bb49d.firebaseapp.com/locationSetter.html?"+name1+","+email+","+city+","+state;
    
  } else {
    // No user is signed in.
  }
});
}




function logout () {
  // body... 

  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    localStorage.removeItem("hospitalName");
    window.location.replace("signup.html");
  }, function(error) {
    // An error happened.
    aler(error);
  });
}




function onBloodSelect(parameter){
  // body... 
  if(parameter.style.backgroundColor == "orange"){
    parameter.style.backgroundColor = "green";
    blood1.push(parameter.innerHTML); 
  }else {

    parameter.style.backgroundColor = "orange";
    blood1.pop(parameter.innerHTML);
    
  }
  
}

function onTreatmentSelect(parameter){
  // body... 
  if(parameter.style.backgroundColor == "orange"){
    parameter.style.backgroundColor = "green";
    treatment1.push(parameter.innerHTML); 
  }else {

    parameter.style.backgroundColor = "orange";
    treatment1.pop(parameter.innerHTML);
    
  }
  
}

function onFacilitiesSelect(parameter){
  // body... 
  if(parameter.style.backgroundColor == "orange"){
    parameter.style.backgroundColor = "green";
    facilities1.push(parameter.innerHTML); 
  }else {

    parameter.style.backgroundColor = "orange";
    facilities1.pop(parameter.innerHTML);
    
  }
  
}


function submit(){

  var hname = document.getElementById("hospital_name").value;
  var hcontact1 = document.getElementById("hcontact").value;
  var acontact1 = document.getElementById("acontact").value;
 
  var doctor1 = document.getElementById("doctor").value;
  var state = document.getElementById("state").value;
  var city1 = document.getElementById("city").value;

  var doctorNames = [];
  var doctorSpeciality = [];
  var doctorTo = []
  var doctorFrom = []
  for(i=0;i<counter;i++){

    doctorNames.push(document.getElementById("doctorName"+i).value);
    doctorSpeciality.push(document.getElementById("speciality"+i).value);
    doctorTo.push(document.getElementById("to"+i).value);
    doctorFrom.push(document.getElementById("from"+i).value);

    var doctorDetails1 = []
    doctorDetails1.push(doctorNames);
    doctorDetails1.push(doctorSpeciality);
    doctorDetails1.push(doctorTo);
    doctorDetails1.push(doctorFrom);


  }
  if (city1.split(" ").length>1){
    var city = "";

  var temp = city1.split(" ");
  console.log(temp);
  temp = temp[temp.length-1].toLowerCase();
  city = temp;
}else {
  city = city1;
}

  console.log(city);


  firebase.database().ref("/hospitals/"+state + "/"+ city+"/"+hname).update({
      blood : blood1.toString(),
      treatment : treatment1.toString(),
      facilities : facilities1.toString(),
      doctor : doctor1,
      hcontact : hcontact1,
      acontact : acontact1



    }).then(function(){
      for (j=0; j<doctorNames.length;j++){
        firebase.database().ref("/hospitals/"+state+"/"+city+"/"+hname+"/doctorDetails/"+doctorNames[j]+" "+doctorSpeciality[j]).update({

        to : doctorTo[j],
        from : doctorFrom[j]

      }).then(function(){
        alert("Updated.");
      })
      }
    });

}


function loadData(name,email){
  firebase.database().ref('/hospitalLogins/'+email.split(".")[0]).once('value').then(function(snapshot) {

    console.log(snapshot.val());
    document.getElementById("state").value = snapshot.val().state;
    localStorage.setItem("state", snapshot.val().state);
    document.getElementById("city").value = snapshot.val().city;
    localStorage.setItem("city", snapshot.val().city);

    firebase.database().ref("/hospitals/"+snapshot.val().state+"/"+snapshot.val().city+"/"+name).once('value').then(function(snapshot1){
      if (snapshot1.val() == null){
        document.getElementById("firstTime").style.display  = 'block';
        document.getElementById("firstTime1").style.display  = 'block';
        document.getElementById("names").style.marginTop = '0px';
      }else {
        document.getElementById("names").style.marginTop = '200px';
        document.getElementById("acontact").value = snapshot1.val().acontact;
        document.getElementById("hcontact").value = snapshot1.val().hcontact;
        document.getElementById("doctor").value = snapshot1.val().doctor;
        treatment1 = snapshot1.val().treatment.split(",");
        facilities1 = snapshot1.val().facilities.split(",");
        blood1 = snapshot1.val().blood.split(",");

        

        
       
        setBlood(snapshot1.val().blood.split(","))
        setTreatment(snapshot1.val().treatment.split(","));
        setFacilities(snapshot1.val().facilities.split(","));
      }
    })

    firebase.database().ref("/hospitals/"+ localStorage.getItem("state")+"/"+localStorage.getItem("city")+"/"+name+"/doctorDetails").once('value').then(function(snapshot2){
      

      var x = snapshot2.toJSON();
      console.log(x)
      for (var k in x){
        console.log(k, x[k].from);
        var docName = k.split(" ")[0] +" " + k.split(" ")[1];
        var docSpeciality = k.split(" ")[2];
        document.getElementById('doctorDetails').innerHTML += " <center><div id='Doctor' style='padding-top: 20px'><label>Doctor Name</label><label style='padding-left: 290px'>Speciality</label><label style='padding-left: 250px'>From</label><label style='padding-left: 220px'>To</label><br><input type='text' name='Doctor_name' style='%; width: 300px;text-align: center;padding-left:20px' required id='doctorName"+counter+"' value='"+docName+"'><input type='text' name='Doctor_speciality' style='%; width:300px;text-align: center;margin-left:80px'  required id='speciality"+counter+"' value='"+docSpeciality+"'><input type='text' name='From_Timing' style='%; width: 200px;text-align: center;margin-left:80px' required id='from"+counter+"' value='"+x[k].from+"'><input type='text' name='To_Timing' style='%; width: 200px;text-align: center;margin-left:80px' required id='to"+counter+"' value='"+x[k].to+"'></div></center>"
        counter++;
      }
      
    })
  
  // ...
});
}

function setBlood(bloods){


  for (i=0; i<bloods.length;i++){
   
    document.getElementById("blood"+bloods[i]).style.backgroundColor = 'green';
  }

}

function setTreatment(treatment){
  var treatment2 = new Array();
  
  for (i=0; i<treatment.length;i++){
    if (treatment[i].split(" ")[1] != undefined){
    treatment2.push(treatment[i].split(" ")[0]+treatment[i].split(" ")[1]);
    }else {
      treatment2.push(treatment[i].split(" ")[0]);
    }

  }

  console.log(treatment2);
 
  for (i=0;i<treatment2.length;i++){
    console.log(treatment2[i])
    document.getElementById(treatment2[i]).style.backgroundColor  = 'green';
  }
}

function setFacilities(facilities){
  
  var facilities2 = new Array();
  for (i=0; i<facilities.length;i++){
    if (facilities[i].split(" ")[1] != undefined){
    facilities2.push(facilities[i].split(" ")[0]+facilities[i].split(" ")[1]);
    
    }else {
      facilities2.push(facilities[i].split(" ")[0]);
    }

  }
  console.log(facilities2)
  for (i=0;i<facilities2.length;i++){
    console.log(facilities2[i]);
    document.getElementById(facilities2[i]).style.backgroundColor  = 'green';
  }
}
function locationSetter(){

  var array1 = window.location.href.split("?")[1].split(",")
  var name = array1[0]+" "+array1[1];
  var email = array1[2];
  var city = array1[3];
  var temp = "";

  


  console.log(city);
  var state = array1[4];
  

        navigator.geolocation.getCurrentPosition(function(position){
        var latitude1 = position.coords.latitude;
        var longitude1 = position.coords.longitude;
        var accuracy = position.coords.accuracy;
        
        

        firebase.database().ref("/hospitals/"+state+"/"+city+"/"+name).update({
      longitude : longitude1,
      latitude : latitude1



    }).then(function(){
      document.getElementById("firstTime").innerHTML = "Location Set Successful".bold();
      document.getElementById("firstTime").style.fontSize = '40px';
      document.getElementById("firstTime").style.fontStyle = 'bold';
      document.getElementById("firstTime").style.color = 'orange';
    });
         
       

        


        },function error(msg){alert('Please enable your GPS position future.');  

      }, {maximumAge:600000, timeout:5000, enableHighAccuracy: true});

    }




function addLocation(){
  window.location.replace("getLocation.html");
}

function Addnewdoctor(){
  document.getElementById('doctorDetails').innerHTML += " <center><div id='Doctor' style='padding-top: 20px'><label>Doctor Name</label><label style='padding-left: 290px'>Speciality</label><label style='padding-left: 250px'>From</label><label style='padding-left: 220px'>To</label><br><input type='text' name='Doctor_name' style='%; width: 300px;text-align: center;padding-left:20px' required id='doctorName"+counter+"'><input type='text' name='Doctor_speciality' style='%; width:300px;text-align: center;margin-left:80px'  required id='speciality"+counter+"'><input type='text' name='From_Timing' style='%; width: 200px;text-align: center;margin-left:80px' required id='from"+counter+"'><input type='text' name='To_Timing' style='%; width: 200px;text-align: center;margin-left:80px' required id='to"+counter+"'></div></center>"
  counter++;

};

var emergenciesCounter = 0
function fetchEmergencies(){

  firebase.database().ref('/emergencies/'+localStorage.getItem("state")+"/"+localStorage.getItem("city")+"/"+localStorage.getItem("hospitalName")).once('value').then(function(snapshot){

      localStorage.setItem("phone", snapshot.val().phone)

      document.getElementById("emergencies").innerHTML += "<button style='width: 200px; background-color: orange'  id='"+emergenciesCounter+"' onclick='onClickEmergencies(this)'>"+snapshot.val().userEmail+"</button>";
      emergenciesCounter++;
  })

}

function onClickEmergencies(element){

  localStorage.setItem("emergencyEmail", element.innerHTML);

   firebase.database().ref('/emergencies/'+localStorage.getItem("state")+"/"+localStorage.getItem("city")+"/"+localStorage.getItem("hospitalName")).once('value').then(function(snapshot){

    localStorage.setItem("latitude",snapshot.val().latitude);
    localStorage.setItem("longitude", snapshot.val().longitude);

  }).then(function(){

    window.location.replace("map.html")

  })
  

}


function sendRequest(){
  firebase.database().ref("/verifyRequests/"+localStorage.getItem("state")+"/"+localStorage.getItem("city")+"/"+localStorage.getItem("hospitalName")).update({
    verified : "pending"
  }).then(function(){
    alert("Request Has Been Registered");
  })
  
}





