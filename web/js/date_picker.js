
// Date picker function when document is ready.
// It's only for 'dateOfBirth' and 'date'

$(document).ready(function () {
    var date_input1 = $('input[name="dateOfBirth"]'); //our date input has the name "dateOfBirth"
    var date_input2 = $('input[name="date"]'); //our date input has the name "date"
    
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    var options = {
            format: 'yyyy/mm/dd',
        container: container,
        todayHighlight: true,
        autoclose: true,
      };

    date_input1.datepicker(options);
    date_input2.datepicker(options);
})