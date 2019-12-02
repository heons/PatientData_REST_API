var urlDB = 'https://patient-data-management.herokuapp.com/';
//var urlDB = 'http://127.0.0.1:5000/';

// Record List
var recordList = [];

var getRecordsByPatientID = function (patient_id) {

    $.ajax({
        url: urlDB + "patients/" + patient_id + "/records",
        method: "GET",
        crossDomain: true,
        headers: {
            "Authorization": "JWT " + localStorage.token
        },
        success: function (data) {
            // TODO : may not need
            // Save data for later use
            recordList = data;

            // Display Records data to list
            displayRecordsToList(data);
        }
    }).fail(function () {
        $("#div_record_list").html("error");
    });
    console.log("getAllRecordsByPatientID");
}


var getRecordById = function (record_id, display = "form") {

    let url_send = urlDB + "records/" + record_id;

    $.ajax({
        url: url_send,
        method: "GET",
        crossDomain: true,
        headers: {
            "Authorization": "JWT " + localStorage.token
        },
        success: function (data) {
            if ("form" == display) {
                displayRecordToForm(data[0]);
            } else if ("result" == display) {
                displayRecordsToList(data);
            } else {}
        }
    }).fail(function () {
        $("#div_record_list").html("error");
    });
    console.log("getRecordById");
}


var postRecord = function () {
    // Create a data to post here.
    // Or you could modify function with an argument like function(form)
    let patient_id = localStorage.sel_patient_id;
    let form = createFormDataRecord();

    let settings = {
        "async": true,
        "crossDomain": true,
        headers: {
            "Authorization": token
        },
        url: urlDB + "patients/" + patient_id + "/records",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }

    $.ajax(settings).done(function (response) {
        alert("A record data is posted!!");
        console.log(response);
    });
}

// PUT record by ID
var putRecord = function (record_id) {
    // Create a form data to PUT
    let form = createFormDataPatient();

    // Ajax settings
    let settings = {
        "async": true,
        "crossDomain": true,
        "headers": {
            "Authorization": "JWT " + localStorage.token
        },
        url: urlDB + "records/" + record_id,
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




// Display record to from views
var displayRecordToForm = function (record) {
    document.getElementById("input_patient_id").value = record.patient_id;
    document.getElementById("input_nurse_name").value = record.nurse_name;
    document.getElementById("input_date").value = record.date;
    document.getElementById("input_time").value = record.time;
    document.getElementById("input_type").value = record.type;
    document.getElementById("input_value").value = record.value;
}

// Display record to the list
var displayRecordsToList = function (records, query) {
    // Create a string(html code) to display
    let strDisplay = "";
    let bDisplay = true;

    for (let i = 0; i < records.length; ++i) {
        // Check query
        bDisplay = true;
        if (undefined != query) {
            if ((undefined != query.department) && (query.department != records[i].department)) { bDisplay = false; }
            if ((undefined != query.doctor) && (query.doctor != records[i].doctor)) { bDisplay = false; }
        }

        if (true == bDisplay) {
            //console.log(data[i]._id);
            //console.log(records[i].department);
            strDisplay += '<div class="well  well-lg well-info">';
            strDisplay += '<div class="well-inner">';
            strDisplay += '<span class="pattient-icon"><img class="list-img-card" src="image/user_icon_2.png"></span>';
            strDisplay += '<span class="patient-info"><strong>';
            strDisplay += 'ID(#' + records[i]._id.substring(20, records[i]._id.length) + '): ' + records[i].type + ' ' + records[i].value;
            strDisplay += '</strong></span>';
            strDisplay += '<div class="pull-right">';
            strDisplay += '<div class="btn-group btn-bigger-screen" role="group" aria-label="Basic example">';
            strDisplay += '<button type="button" class="btn btn-warning"' + '" onclick="onClickRecordInfo(\'' + records[i]._id + '\')">' + 'Information</button>';
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
            strDisplay += '<li><a herf="./EditRecord.html" onclick="onClickRecordInfo(\'' + records[i]._id + '\')">Information</a></li>';
            strDisplay += '<li><a href="#">Records</a></li>';
            strDisplay += '</ul>';
            strDisplay += '</div></div></div></div>';
        }
    }

    // Display the contant
    $("#div_record_list").html(strDisplay);

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




// Create form data of a record from form inputs
var createFormDataRecord = function () {
    //TODO : validate inputs
    let patient_id = localStorage.sel_patient_id;
    let nurse_name = document.getElementById("input_nurse_name").value;
    let date = document.getElementById("input_date").value;
    let time = document.getElementById("input_time").value;
    let type = document.getElementById("input_type").value;
    let value = document.getElementById("input_value").value;

    let form = new FormData();
    form.append("patient_id", patient_id);
    form.append("nurse_name", nurse_name);
    form.append("date", date);
    form.append("time", time);
    form.append("type", type);
    form.append("value", value);

    return form;
}



// On click my patient radio button
var onClickGetRecords = function () {
    getRecordsByPatientID(localStorage.sel_patient_id);
}




