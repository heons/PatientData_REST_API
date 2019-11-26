var urlDB = 'https://patient-data-management.herokuapp.com/';
//var urlDB = 'http://127.0.0.1:5000/';

// token after login
var token;

var postLogin = function () {
  // Create a data to post here.
  // Or you could modify function with an argument like function(form)
  let form = new FormData();
  let formEmail = document.getElementById("inputUsername");
  let formPassword = document.getElementById("inputPassword");
  form.append("email", formEmail.value);
  form.append("password", formPassword.value);

  let settings = {
    "async": true,
    "crossDomain": true,
    "url": urlDB + "auth/sign_in",
    "method": "POST",
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": form
  }

  $.ajax(settings).done(function (response) {
    //alert("login is done!!");
    //console.log(response);
    token = response.token;
    console.log(window.location.pathname);
    console.log(window.location.hostname);
    //TODO : 11 is fixed value for 'Lonin.html', find better way
    window.location.href = window.location.href.substring(0, window.location.href.length - ('Login.html'.length)) + 'ViewPatient.html';
    //console.log(token);
  }).fail(function (response) {
    //login fails
    //alert("login is failed!!");
    document.getElementById("check_login_info").textContent = 'Check Userame and Password';
    
  });
}


var postLogout = function (cur_page) {
  // Create a data to post here.
  // Or you could modify function with an argument like function(form)
  token = "";
  
  window.location.href = window.location.href.substring(0, window.location.href.length - (cur_page.length)) + 'Login.html';
  console.log(window.location.href);
}