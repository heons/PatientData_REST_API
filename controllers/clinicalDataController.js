'use strict';

var mongoose = require('mongoose');
var ClinicalData = require('../models/ClinicalData');


// Get all the records by its patient id
exports.get_all_records_by_patient_id = function (req, res, next) {
    console.log('GET request: patients/:id/records -' + req.params.id);

    // Find records by its id
    ClinicalData.find({ patient_id: req.params.id }).exec(function (error, record) {
      // If there are any errors, pass them to next in the correct format
      //if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))

        if (record) {
            // Send the patient if no issues
            res.send(record)
        } else {
            // Send 404 header if the patient doesn't exist
            res.send(404)
        }
    })
};


// Create a single record by its patient id
exports.create_a_record_by_patient_id = function (req, res, next) {
    console.log('POST request: patients/:id/records');

    // Get data from the request
    let data = req.params;
    if (Object.entries(req.params).length === 1) { 
        console.log('param empty: trying to get from body');
        data = req.body;
    }
    data.id = req.params.id;

   // Make sure field is defined
   if (data.nurse_name === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('nurse_name must be supplied'))
    }
    if (data.date === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('date must be supplied'))
    }
    if (data.time === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('time must be supplied'))
    }
    if (data.type === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('type must be supplied'))
    }
    if (data.value === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('value must be supplied'))
    }
    

    // Creating new clinical data.
    let newClinicalData = new ClinicalData({
        patient_id: data.id,
        nurse_name: data.nurse_name,
        date: data.date,
        time: data.time,
        type: data.type,
        value: data.value
    });

    // Create the patient and saving to db
    newClinicalData.save(function (error, result) {
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send the patient if no issues
        res.send(201, result)
    });
};


// Get a record by its record id
exports.get_a_record_by_id = function (req, res, next) {
    console.log('GET request: records/:id - ' + req.params.id);

    // Find records by its id
    ClinicalData.find({ _id: req.params.id }).exec(function (error, record) {
      // If there are any errors, pass them to next in the correct format
      //if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))

        if (record) {
            // Send the patient if no issues
            res.send(record)
        } else {
            // Send 404 header if the patient doesn't exist
            res.send(404)
        }
    })
};


// Update a record by its record id
exports.update_a_record_by_id = function (req, res, next) {
    console.log('PUT records: patients/:id');

    // Get data from the request
    let data = req.params;
    if (Object.entries(req.params).length === 1) { 
        console.log('param empty: trying to get from body');
        data = req.body;
    }
    data.id = req.params.id;

     // Creating new patient.
    let newClinicalData = new ClinicalData({
       _id: data.id
    });

    // Make add fields to patient data to update
    if (data.nurse_name !== undefined) {
        newClinicalData.nurse_name = data.nurse_name;
    }
    if (data.date !== undefined) {
        newClinicalData.date = data.date;
    }
    if (data.time !== undefined) {
        newClinicalData.time = data.time;
    }
    if (data.type !== undefined) {
        newClinicalData.type = data.type;
    }
    if (data.value !== undefined) {
        newClinicalData.value = data.value;
    }

    // Update
    /*
    it will return as
        {
        "n": 1,
        "nModified": 1,
        "ok": 1
        }
    */
    ClinicalData.updateOne(
        { _id: data.id }
        , { $set: newClinicalData }
        , function (error, result) {
            // If there are any errors, pass them to next in the correct format
            if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))
    
            // Send the patient if no issues
            res.send(201, result)
        });
};


// Delete a record with the given id
exports.delete_a_record_by_id = function (req, res, next) {
    console.log('DEL request: records/:id - ' + req.params.id);
    ClinicalData.deleteOne({ _id: req.params.id }, function (error, result) {
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))

        console.log(result);
        // Send a 200 OK response
        res.send(201, result)
    });
};