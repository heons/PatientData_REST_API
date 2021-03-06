var urlDB = 'https://patient-data-management.herokuapp.com/';
//var urlDB = 'http://127.0.0.1:5000/';

// Patient List
var patientList = [];


// GET patients
var getPatients = function (query) {
  // Create URL
  let url_send = urlDB + "patients";

  $.ajax({
    url: url_send,
    method: "GET",
    crossDomain: true,
    headers: {
      "Authorization": "JWT " + localStorage.token
    },
    success: function (data) {
      // TODO : may not need
      // Save data for later use
      patientList = data;

      // Display Patients data to list
      displayPatientsToList(data, query);
    }
  }).fail(function () {
    $("#div_patient_list").html("error");
  });
  console.log("getPatients");
}


// GET patient ID
var getPatientbyId = function (patient_id, display = "form") {
  // Create URL
  let url_send = urlDB + "patients/" + patient_id;

  $.ajax({
    url: url_send,
    method: "GET",
    crossDomain: true,
    headers: {
      "Authorization": "JWT " + localStorage.token
    },
    success: function (data) {
      if ("form" == display) {
        displayPaientToForm(data[0]);
      } else if ("result" == display) {
        displayPatientsToList(data);
      } else if ("profile" == display) {
        displayPatientProfile(data[0]);
      } else { }
    }
  }).fail(function () {
    //display error
  });
  console.log("getPatientbyId");
}

// Display patient to from views
var displayPaientToForm = function (patient) {
  document.getElementById("input_first_name").value = patient.first_name;
  document.getElementById("input_last_name").value = patient.last_name;
  document.getElementById("input_sex").value = patient.sex;
  document.getElementById("input_date_of_birth").value = patient.date_of_birth;
  document.getElementById("input_address").value = patient.address;
  document.getElementById("input_department").value = patient.department;
  document.getElementById("input_doctor").value = patient.doctor;
}

// Display patient to the list
var displayPatientsToList = function (patients, query) {
  // Create a string(html code) to display
  let strDisplay = "";
  let bDisplay = true;

  for (let i = 0; i < patients.length; ++i) {
    // Check query
    bDisplay = true;
    if (undefined != query) {
      if ((undefined != query.department) && (query.department != patients[i].department)) { bDisplay = false; }
      if ((undefined != query.doctor) && (query.doctor != patients[i].doctor)) { bDisplay = false; }
    }

    if (true == bDisplay) {
      //console.log(data[i]._id);
      //console.log(patients[i].department);
      strDisplay += '<div class="well  well-lg well-info">';
      strDisplay += '<div class="well-inner">';
      strDisplay += '<span class="pattient-icon"><img class="list-img-card" src="image/user_icon_2.png"></span>';
      strDisplay += '<span class="patient-info"><strong>';
      strDisplay += i+1 + ": " + patients[i].first_name + ' ' + patients[i].last_name;
      strDisplay += ' (' + patients[i].sex + ', ' + patients[i].date_of_birth + ')';
      strDisplay += '</strong></span>';
      strDisplay += '<div class="pull-right">';
      strDisplay += '<div class="btn-group btn-bigger-screen" role="group" aria-label="Basic example">';
      strDisplay += '<button type="button" class="btn btn-warning"' + '" onclick="onClickPatientInfo(\'' + patients[i]._id + '\')">' + 'Information</button>';
      strDisplay += '<button type="button" class="btn btn-success"' + '" onclick="onClickRecords(\'' + patients[i]._id + '\')">' + 'Records</button>';
      strDisplay += '</div>';
      strDisplay += '<div class="btn-group btn-smaller-screen" style="display: none;">';
      strDisplay += '<button type="button" class="btn btn-primary dropdown-toggle disabled" data-toggle="dropdown">';
      strDisplay += '<span class="glyphicon glyphicon-list-alt"></span>';
      strDisplay += '</button>';
      strDisplay += '<button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown">';
      strDisplay += '<span class="caret"></span>';
      strDisplay += '</button>';
      strDisplay += '<ul class="dropdown-menu" role="menu">';
      strDisplay += '<li><a herf="./EditPatient.html" onclick="onClickPatientInfo(\'' + patients[i]._id + '\')">Information</a></li>';
      strDisplay += '<li><a herf="./ViewRecords.html" onclick="onClickRecords(\'' + patients[i]._id + '\')">Records</a></li>';
      strDisplay += '</ul>';
      strDisplay += '</div></div></div></div>';
    }
  }

  // Display the contant
  $("#div_patient_list").html(strDisplay);

  // Responsiveness on buttons
  if ($(window).width() < 585) {
    $(".btn-smaller-screen").show();
    $(".btn-bigger-screen").hide();
  }
  else {
    $(".btn-smaller-screen").hide();
    $(".btn-bigger-screen").show();
  }
}

// Display patient to the list
var displayPatientProfile = function (patient) {
  // Create a string(html code) to display
  let strDisplay = "";
  //console.log(data[i]._id);
  //console.log(patients[i].department);
  strDisplay += '<span class="pattient-icon"><img class="list-img-title" src="image/user_icon_2.png"></span>';
  strDisplay += '<span class="patient-info"><strong>';
  strDisplay += 'ID(#' + patient._id.substring(20, patient._id.length) + '): ' + patient.first_name + ' ' + patient.last_name;
  strDisplay += ' (' + patient.sex + ', ' + patient.date_of_birth + ')';
  strDisplay += '</strong></span>';
  strDisplay += '<div class="pull-right">';
  strDisplay += '<button type="button" class="btn btn-primary" onclick="onClickAddRecord()">';
  strDisplay += '<span class="glyphicon glyphicon-plus"></span> Add';
  strDisplay += '</button></div>';    

  // Display the contant
  $("#div_patient_profile").html(strDisplay);
}

// POST patients
var postPatient = function () {
  // Create a form data to PUT
  let form = createFormDataPatient();

  // Ajax settings
  let settings = {
    "async": true,
    "crossDomain": true,
    "headers": {
      "Authorization": "JWT " + localStorage.token
    },
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


// PUT patient by ID
var putPatient = function (patient_id) {
  // Create a form data to PUT
  let form = createFormDataPatient();

  // Ajax settings
  let settings = {
    "async": true,
    "crossDomain": true,
    "headers": {
      "Authorization": "JWT " + localStorage.token
    },
    url: urlDB + "patients/" + patient_id,
    method: "PUT",
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": form
  }

  $.ajax(settings).done(function (response) {
    alert("A data is changed!!");
    console.log(response);
  });
}

// Create form data of a patient from form inputs
var createFormDataPatient = function () {
  //TODO : validate inputs
  let first_name = document.getElementById("input_first_name").value;
  let last_name = document.getElementById("input_last_name").value;
  let sex = document.getElementById("input_sex").value;
  let date_of_birth = document.getElementById("input_date_of_birth").value;
  let address = document.getElementById("input_address").value;
  let department = document.getElementById("input_department").value;
  let doctor = document.getElementById("input_doctor").value;

  let form = new FormData();
  form.append("first_name", first_name);
  form.append("last_name", last_name);
  form.append("sex", sex);
  form.append("date_of_birth", date_of_birth);
  form.append("address", address);
  form.append("department", department);
  form.append("doctor", doctor);

  return form;
}




// On click Information of a patient - go to edit patient
var onClickPatientInfo = function (paitent_id) {
  //console.log(curPatient);
  //localStorage.setItem("cur_patient", JSON.stringify(curPatient));
  //console.log(JSON.parse(localStorage.cur_patient));
  localStorage.setItem("sel_patient_id", paitent_id);
  console.log(localStorage.sel_patient_id);
  window.location.href = localStorage.baseURL + 'EditPatient.html';
}

// On click records - go to view record
var onClickRecords = function (paitent_id) {
  //console.log(curPatient);
  //localStorage.setItem("cur_patient", JSON.stringify(curPatient));
  //console.log(JSON.parse(localStorage.cur_patient));
  localStorage.setItem("sel_patient_id", paitent_id);
  console.log(localStorage.sel_patient_id);
  window.location.href = localStorage.baseURL + 'ViewRecord.html';
}


// On click my patient radio button
var onClickGetMyPatients = function () {
  let query = {
    "doctor": localStorage.user_name
  };
  getPatients(query);
}

// On click search by id button
var onClickSearchById = function () {
  let patient_id = document.getElementById("input_search_by_id").value;
  getPatientbyId(patient_id, 'result');
}

// On click search by department button
var onClickSearchByDepartment = function () {
  let department = document.getElementById("input_search_by_department").value;
  let query = {
    "department": department
  };
  getPatients(query);
}
