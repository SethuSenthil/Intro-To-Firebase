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
     //Step 1: Uncomment or reweite line, in this line we are declaring a new instance of Firebase. 
     // (Step 1) const app = firebase.app();
    console.log(app);
});

// Global Vars
var userNameDisplay = document.getElementById('userDisplayName'),
    userPhotoDisplay = document.getElementById('photoUser'),
    methodOfLogin, 
    luck;

    //Function for Google Oauth login
function googleLogin() {
         //Step 2: Uncomment or reweite line, in this line we are declaring a new instance of firebase's Google auth method into a variable so we dont have a long line of unreadable code. 
    //(Step 2) const provider = new firebase.auth.GoogleAuthProvider();
    //Step 3: Uncomment or reweite line, This line calls the firebase auth function as well as 'signInWithPopup' and passes in the Google auth method we stored in a var.
    //(Step 3) firebase.auth().signInWithPopup(provider)

    //Some ES16 goodness here
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
            //Step 4: firebase.auth().currentUser is an object that give us all the information about the current user
              //One important property is labeled as displayName, witch stores the 'display name' or the name of the user.
            // (step 4) userNameDisplay.innerText = firebase.auth().currentUser.displayName;  //Replaces login with users name
            document.getElementById('userPhoto').style.display = 'none'; //Hides genric user icon
            document.getElementById('unrestricted').style.display = 'none'; //Removes unrestricted content 
            document.getElementById('restricted').style.display = 'block';//Showes generated unrestricted content 
            document.getElementById('userPhoto').style.visibility = 'hidden';
            userPhotoDisplay.style.display = 'block'; //Renders user photo

            //Step 4: Another property is defined as 'photoURL' 
             //This stores PATH <--(Remember its just the path) to the users profile pic they set on the Google platform 
             //These images usually load pretty fast because they are uploaded in Googles CDN's
             //Since this give just the path, we will need to change the SRC attribute of a image in our HTML
             //Finish the line below, we have wired it up to the front end so you dont have to worry about it!
            userPhotoDisplay.src = firebase.auth().currentUser.//Type the ending here ; 

           //Step 4: It isn't a surprise that you can also retrieve the users Email using Google auth...
            // The property 'email' stores the users ... you guessed it ... the users email
            document.getElementById('userEmail').innerText = firebase.auth().currentUser.email; //Gets and prints user email (got from Google)
            document.getElementById('userFortune').innerText = `Your Name has ${nameLength} letters. Our non-existent tensor flow model predicts ${luck}`; //Prints users prediction using their Name (sample function)
            const user = result.user; 
            console.log('The following log will show you the properties of the object (firebase.auth().currentUser)');
            console.log(firebase.auth().currentUser);
        })
}

//Function that loges in users with Email
function login() {
methodOfLogin = 'Email';
    var userEmail = document.getElementById("email_field").value; //Gets values from textboxes and saves them as vars 
    var userPass = document.getElementById("password_field").value;
//Step 5: In this step we are creating a new instance of firebase auth similar to last step but
  //But this time we will be using the 'signInWithEmailAndPassword' method instead caus ... do I have to explain?
  //This function takes in two arguments, In this case the Email and the Password
  //We store the values of the textboxes, that contain the Email and Passowrd into a var so we will use it as our two arguments.

    //firebase.auth().signInWithEmailAndPassword(userEmail, userPass) 
    //passes in two arguments (the vars), into the firebase login function
        .then(result => {
            //Things to do if the user logsin 
              //Not much caus all we can get is the user Email
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
//Simple functions that show the modal
function showLoginEmail() {
    $('#withGmail').modal('show'); 
}

function showSignUpEmail() {
    $('#withGmailSG').modal('show');
}

//Warning: Fun Stuff
//The signup (by email) function 
function signUp() {
    var userEmail = document.getElementById("email_field_sg").value; //Gets values from textboxes and saves them as vars 
    var userPass = document.getElementById("password_field_sg").value;
 //Step 6: Very similar to setp 5 but this time we are creating a new user in our Firebase user database
   //This time we will be using createUserWithEmailAndPassword function caus it sounds like it will get the job done
   //This function also takes two arguments, Email and Passwor
   //Thats it! You created a new user!
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass) 

        .then(result => {
            //Stuff to do after account created
            console.log('created account with password ayyy!'); 
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
document.getElementsByClassName('fa-file-powerpoint')[0].addEventListener('mouseover', function(){
    noti.innerText = 'google_logo Slides';
});
document.getElementsByClassName('fa-file-powerpoint')[0].addEventListener('mouseout', function(){
    noti.innerText = window.location.href;
});
document.getElementsByClassName('google-button')[0].addEventListener('mouseover', function(){
    noti.innerText = 'Sign In with google_logo';
});
document.getElementsByClassName('google-button')[0].addEventListener('mouseout', function(){
    noti.innerText = window.location.href;
});
document.getElementsByClassName('google-button')[1].addEventListener('mouseover', function(){
    noti.innerText = 'Sign In with Email';
});
document.getElementsByClassName('google-button')[1].addEventListener('mouseout', function(){
    noti.innerText = window.location.href;
});



