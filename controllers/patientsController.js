'use strict';

var mongoose = require('mongoose');
var Patients = require('../models/Patients');


// Get all patients in the system
exports.get_all_patients = function (req, res, next) {
    console.log('GET request: patients');
    // Find every entity within the given collection
    Patients.find({}).exec(function (error, result) {
        if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))
        res.send(result);
    });
};


// Create a new patient
exports.create_a_patient = function (req, res, next) {
    console.log('POST request: patients');

    // Get data from the request
    let data = req.params;
    if (Object.entries(req.params).length === 0) { 
        console.log('param empty: trying to get from body');
        data = req.body;
    }
    
    // Make sure name is defined
    if (data.first_name === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('first_name must be supplied'))
    }
    if (data.last_name === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('last_name must be supplied'))
    }

    // Creating new patient.
    let newPatient = new Patients({
        first_name: data.first_name,
        last_name: data.last_name,
        address: data.address,
        sex: data.sex,
        date_of_birth: data.date_of_birth,
        department: data.department,
        doctor: data.doctor
    });


    // Create the patient and saving to db
    newPatient.save(function (error, result) {
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send the patient if no issues
        res.send(201, result)
    });
};


// Get a single patient by their patient id
exports.get_a_patient_by_id = function (req, res, next) {
    console.log('GET request: patients/:id - ' + req.params.id);

    // Find a single patient by their id
    Patients.find({ _id: req.params.id }).exec(function (error, patient) {
      // If there are any errors, pass them to next in the correct format
      // if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))

        if (patient) {
            // Send the patient if no issues
            res.send(patient)
        } else {
            // Send 404 header if the patient doesn't exist
            res.send(404)
        }
    })
};


// Update a single patient by its patient id
exports.update_a_patient_by_id = function (req, res, next) {
    console.log('PUT request: patients/:id');

    //console.log('params');
    //console.log(req.params);
    //console.log('body');
    //console.log(req.body);

    // Get data from the request
    let data = req.params;
    if (Object.entries(req.params).length === 1) { 
        console.log('param empty: trying to get from body');
        data = req.body;
    }
    data.id = req.params.id; // ID is always from param

     // Creating new patient.
    let newPatient = new Patients({
       _id: data.id 
    });

    // Make add fields to patient data to update
    if (data.first_name !== undefined) {
        newPatient.first_name = data.first_name;
    }
    if (data.last_name !== undefined) {
        newPatient.last_name = data.last_name;
    }
    if (data.address !== undefined) {
        newPatient.address = data.address;
    }
    if (data.sex !== undefined) {
        newPatient.sex = data.sex;
    }
    if (data.date_of_birth !== undefined) {
        newPatient.date_of_birth = data.date_of_birth;
    }
    if (data.department !== undefined) {
        newPatient.department = data.department;
    }
    if (data.doctor !== undefined) {
        newPatient.doctor = data.doctor;
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
    Patients.updateOne(
        { _id: data.id }
        , { $set: newPatient }
        , function (error, result) {
            // If there are any errors, pass them to next in the correct format
            if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))
    
            // Send the patient if no issues
            res.send(201, result)
        });
};


// Delete patient with the given id
exports.delete_a_patient_by_id = function (req, res, next) {
    console.log('DEL request: patients/' + req.params.id);
    Patients.deleteOne({ _id: req.params.id }, function (error, result) {
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send a 200 OK response
        res.send(201, result)
    });
};


