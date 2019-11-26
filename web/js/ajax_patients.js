var urlDB = 'https://patient-data-management.herokuapp.com/';
//var urlDB = 'http://127.0.0.1:5000/';

var patientList = [];

var getPatients = function(patient_id){
            
  let url_send = urlDB + "patients";
  if (undefined != patient_id) {
    url_send = url_send + "/" + patient_id;
  }

  $.ajax({
    url: url_send,
    method: "GET",
    crossDomain: true,
    success: function (data) {

      patientList = data;
      let strDisplay = "";
      for (let i = 0; i < patientList.length; ++i) {
        console.log(patientList[i]._id);
        strDisplay += '<div class="well  well-lg well-info">';
        strDisplay += '<div class="well-inner">';
        strDisplay += '<span class="pattient-icon"><img class="list-img-card" src="image/user_icon_2.png"></span>';
        strDisplay += '<span class="patient-info"><strong>';
        strDisplay += 'ID(#' + patientList[i]._id.substring(20, patientList[i]._id.length) + '): ' + patientList[i].first_name + ' ' + patientList[i].last_name;
        strDisplay += '</strong></span>';
        strDisplay += '<div class="pull-right">';
        strDisplay += '<div class="btn-group btn-bigger-screen" role="group" aria-label="Basic example">';
        strDisplay += '<button type="button" class="btn btn-warning">Information</button>';
        strDisplay += '<button type="button" class="btn btn-success">Records</button>';
        strDisplay += '</div>';
        strDisplay += '<div class="btn-group btn-smaller-screen" style="display: none;">';
        strDisplay += '<button type="button" class="btn btn-primary dropdown-toggle disabled" data-toggle="dropdown">';
        strDisplay += '<span class="glyphicon glyphicon-list-alt"></span>';
        strDisplay += '</button>';
        strDisplay += '<button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown">';
        strDisplay += '<span class="caret"></span>';
        strDisplay += '</button>';
        strDisplay += '<ul class="dropdown-menu" role="menu">';
        strDisplay += '<li><a href="#">Information</a></li>';
        strDisplay += '<li><a href="#">Records</a></li>';
        strDisplay += '</ul>';
        strDisplay += '</div></div></div></div>';
      }

      $("#div_patient_list").html(strDisplay);
    }
  }).fail(function () {
    $("#div_patient_list").html("error");
  });
  console.log("getPatients");
}




var postPatient = function () {
  // Create a data to post here.
  // Or you could modify function with an argument like function(form)

//TODO : validate inputs
  let first_name = document.getElementById("input_first_name").value;
  let last_name = document.getElementById("input_last_name").value;
  let sex = document.getElementById("input_sex").value;
  let date_of_birth = document.getElementById("input_date_of_birth").value;
  //let address = document.getElementById("input_address").value;
  let department = document.getElementById("input_department").value;
  let doctor = document.getElementById("input_doctor").value;


  let form = new FormData();
  form.append("first_name", first_name);
  form.append("last_name", last_name);
  form.append("sex", sex);
  form.append("date_of_birth", date_of_birth);
  form.append("address", "28");
  form.append("department", department);
  form.append("doctor", doctor);


  let settings = {
    "async": true,
    "crossDomain": true,
    "url": urlDB + "patients",
    "method": "POST",
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": form
  }

  $.ajax(settings).done(function (response) {
    alert("A data is posted!!");
    console.log(response);
  });
}
