//Register service worker so we can send notifications
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        if (Notification.permission !== 'denied' || Notification.permission === "default") {
            Notification.requestPermission(function (permission) {
              // If the user accepts, let's create a notification
              if (permission === "granted") {
                 new Notification("Notification Allowed Successfully");
              }
            });
        }
      }, function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }

//Declares 'new firebase app' instance when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    console.log(app);
});

// Global Vars
var userNameDisplay = document.getElementById('userDisplayName'),
    userPhotoDisplay = document.getElementById('photoUser'),
    methodOfLogin,
    luck;

    //Function for Google Oauth login
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)

        .then(result => {
            //Actions after Google login
            methodOfLogin = 'Oauth'; 
            new Notification("Successfully Logged In");
            var nameLength = firebase.auth().currentUser.displayName.length - 1; //Why -1? .length counts all the characters inclouding the space between the users first and last name.
            //Super simple response using user name length as a var   
            if (nameLength >= 15) {
                luck = 'You will be connected to SB BYOD network for the next 10 ms';
            } else if (nameLength <= 15) {
                luck = `that you read this message on ${new Date()}`;
            }
            userNameDisplay.innerText = firebase.auth().currentUser.displayName;  //Replaces login with users name
            document.getElementById('userPhoto').style.display = 'none'; //Hides genric user icon
            document.getElementById('unrestricted').style.display = 'none'; //Removes unrestricted content 
            document.getElementById('restricted').style.display = 'block';//Showes generated unrestricted content 
            document.getElementById('userPhoto').style.visibility = 'hidden';
            userPhotoDisplay.style.display = 'block'; //Renders user photo
            userPhotoDisplay.src = firebase.auth().currentUser.photoURL; //Changes user photo src (got from Google)
            document.getElementById('userEmail').innerText = firebase.auth().currentUser.email; //Gets and prints user email (got from Google)
            document.getElementById('userFortune').innerText = `Your Name has ${nameLength} letters. Our non-existent tensor flow model predicts ${luck}`; //Prints users prediction using their Name (sample function)
            const user = result.user;
            console.log('The following log will show you the properties of the object (user)');
            console.log(user);
        })
}

function login() {
methodOfLogin = 'Email';
    var userEmail = document.getElementById("email_field").value; //Gets values from textboxes and saves them as vars 
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass) //passes in two arguments (the vars), into the firebase login function
        .then(result => {
           new Notification("Successfully Logged In");
            userNameDisplay.innerText  = userEmail;
            document.getElementById('userEmail').innerText = userEmail;
            console.log('logged in with pass');
            document.getElementById('unrestricted').style.display = 'none';
            document.getElementById('restricted').style.display = 'block';
            document.getElementById('userFortune').innerText = `U logged in with email, cool`;
            $('#withGmail').modal('hide');
        })
        .catch(function (error) {
            //If error it will push it using a js alert
            var errorCode = error.code;
            var errorMessage = error.message;

            window.alert("Error : " + errorMessage);


        });
}
//This show button method had to be used because Bootstrap wont allow data-toggles on dropdowns (ugh)
function showLoginEmail() {
    $('#withGmail').modal('show');
}

function showSignUpEmail() {
    $('#withGmailSG').modal('show');
}
function signUp() {
    var userEmail = document.getElementById("email_field_sg").value; //Gets values from textboxes and saves them as vars 
    var userPass = document.getElementById("password_field_sg").value;

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass) //Passes in two arguments into firebase sign up function (this creats a new user)

        .then(result => {
            console.log('logged with password ayyy!'); 
            $('#withGmailSG').modal('hide');
            new Notification("Successfully Created an Account, Now login");
        })

        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

        });
}
function logout() {
    //Actions for both auth types 
    document.getElementById('userDisplayName').innerText = 'Login' //Changes navbar text back to normal
    document.getElementById('unrestricted').style.display = 'block'; //Show unrestricted content again
    document.getElementById('restricted').style.display = 'none'; //Hide restricted content
    document.getElementById('userEmail').innerText = ''; //No user email

    if (methodOfLogin === 'Oauth') {
    //Actions for Google Oauth only 

        firebase.auth().signOut().then(function () {
            userNameDisplay = 'Login';
            document.getElementById('userPhoto').style.display = 'block'; //Shows genric user fa icon
            document.getElementById('photoUser').style.display = 'none'; //Hide user photo 
            document.getElementById('photoUser').src = ''; //Reset user photo src to null
            new Notification('logged out');
        }, function (error) {
            new Notification('an error stopped you from loggin out');
        });
    }else {
        userNameDisplay = 'Login';
    //Actions if user was logged in with email
    }
}

//Footer stuff (Dont worry about it)
var noti =  document.getElementById('whatHover');
noti.innerText = window.location.href;
document.getElementsByClassName('fa-star')[0].addEventListener('mouseover', function(){
    noti.innerText = 'Star on Github';
});
document.getElementsByClassName('fa-star')[0].addEventListener('mouseout', function(){
    noti.innerText = window.location.href;
});
document.getElementsByClassName('fa-book')[0].addEventListener('mouseover', function(){
    noti.innerText = 'Documentation';
});
document.getElementsByClassName('fa-book')[0].addEventListener('mouseout', function(){
    noti.innerText = window.location.href;
});

