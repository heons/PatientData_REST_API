var urlDB = 'https://patient-data-management.herokuapp.com/';
//var urlDB = 'http://127.0.0.1:5000/';



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
    response = JSON.parse(response);
    //console.log(response);

    // Set user data : token, user_name
    localStorage.setItem("token", response.token);
    localStorage.setItem("user_name", response.full_name);
   
    //TODO : 11 is fixed value for 'Lonin.html', find better way
    window.location.href = window.location.href.substring(0, window.location.href.length - ('Login.html'.length)) + 'ViewPatient.html';
    //console.log(token);

    // set to empty
    localStorage.setItem("sel_patient_id", "");
  }).fail(function (response) {
    //login fails
    //alert("login is failed!!");
    document.getElementById("check_login_info").textContent = 'Check Userame and Password';
    
  });
}


var postLogout = function (cur_page) {
  // Reset user data : token, user_name
  localStorage.setItem("token", "");
  localStorage.setItem("user_name", "");
  
  window.location.href = window.location.href.substring(0, window.location.href.length - (cur_page.length)) + 'Login.html';
  console.log(window.location.href);
}


var rememberMe = function () {
  if (localStorage.chkbx && localStorage.chkbx != '') {
    $('#remember_me').attr('checked', 'checked');
    $('#inputUsername').val(localStorage.usrname);
    $('#inputPassword').val(localStorage.pass);
  } else {
    $('#remember_me').removeAttr('checked');
    $('#inputUsername').val('');
    $('#inputPassword').val('');
  }

  $('#remember_me').click(function () {

    if ($('#remember_me').is(':checked')) {
      // save username and password
      localStorage.usrname = $('#inputUsername').val();
      localStorage.pass = $('#inputPassword').val();
      localStorage.chkbx = $('#remember_me').val();
    } else {
      localStorage.usrname = '';
      localStorage.pass = '';
      localStorage.chkbx = '';
    }
  });
};