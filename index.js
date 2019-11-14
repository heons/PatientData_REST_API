"use strict";
/**
 * Installs:
 * npm install mongoose
 * npm install restify
 * npm install restify-errors
 * npm install restify-cors-middleware --save
 *
 * npm install @types/node
 * npm install @types/mongoose
 * npm install @types/restify
 * npm install @types/restify-errors
 * npm install @types/restify-cors-middleware --save-dev
 */
exports.__esModule = true;
var corsMiddleware = require("restify-cors-middleware");
//import * as restify from 'restify';
//import * as errs from 'restify-errors'
/*------ Basic constant values for the server ------*/
var SERVER_NAME = 'healthrecords'; // Server name
var DEFAULT_PORT = 5000; // Default port number
/*------ Requirements ------*/
var restify = require('restify'); // REST
var errs = require('restify-errors'); // To handle restify errors
/*------ Assign values for the DB connection ------*/
// Assign port value
var port = process.env.PORT;
if (typeof port === "undefined") {
    console.warn('No process.env.PORT var, using default port: ' + DEFAULT_PORT);
    port = DEFAULT_PORT.toString();
}
;
/*------ MongoDB ------*/
var connectToDatabase = require('./db');
connectToDatabase(); // Connect to the DB
// Compiles the schema into a model, opening (or creating, ifnonexistent) 
// the 'Patients' collection in the MongoDB database
var Patients = require('./models/Patients');
// the 'ClinicalData' collection in the MongoDB database
var ClinicalData = require('./models/ClinicalData');
/*------ Sever implementation ------*/
// Create the restify server
var server = restify.createServer({ name: SERVER_NAME });
// CORS enables to all domain. : PUT is error if not.
// https://codepunk.io/using-cors-with-restify-in-nodejs/
var cors = corsMiddleware({
    origins: ["*"],
    allowHeaders: ["Authorization"],
    exposeHeaders: ["Authorization"]
});
server.pre(cors.preflight);
server.use(cors.actual);
server
    // Allow the use of POST
    .use(restify.plugins.fullResponse())
    // Maps req.body to req.params so there is no switching between them
    .use(restify.plugins.bodyParser());
// Start listening
server.listen(port, function () {
    console.log('Server %s listening at %s', server.name, server.url);
    console.log('Resources:');
    console.log(' /patients                 GET, POST');
    console.log(' /patients/:id             GET, PUT, DELETE');
    console.log(' /patients/:id/records     GET, POST');
    console.log(' /records/:id              GET, PUT, DELETE');
});
// Get all patients in the system
server.get('/patients', function (req, res, next) {
    console.log('GET request: patients');
    // Find every entity within the given collection
    Patients.find({}).exec(function (error, result) {
        if (error)
            return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)));
        res.send(result);
    });
});
// Get a single patient by their patient id
server.get('/patients/:id', function (req, res, next) {
    console.log('GET request: patients/:id - ' + req.params.id);
    // Find a single patient by their id
    Patients.find({ _id: req.params.id }).exec(function (error, patient) {
        // If there are any errors, pass them to next in the correct format
        //if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))
        if (patient) {
            // Send the patient if no issues
            res.send(patient);
        }
        else {
            // Send 404 header if the patient doesn't exist
            res.send(404);
        }
    });
});
// Update a single patient by its patient id
server.put('/patients/:id', function (req, res, next) {
    console.log('PUT request: patients/:id');
    //console.log('params');
    //console.log(req.params);
    //console.log('body');
    //console.log(req.body);
    // Get data from the request
    var data = req.params;
    if (Object.entries(req.params).length === 1) {
        console.log('param empty: trying to get from body');
        data = req.body;
    }
    // Creating new patient.
    var newPatient = new Patients({
        _id: req.params.id // ID is always from param
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
    Patients.updateOne({ _id: req.params.id }, { $set: newPatient }, function (error, result) {
        // If there are any errors, pass them to next in the correct format
        if (error)
            return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)));
        // Send the patient if no issues
        res.send(201, result);
    });
});
// Create a new patient
server.post('/patients', function (req, res, next) {
    console.log('POST request: patients');
    // Get data from the request
    var data = req.params;
    if (Object.entries(req.params).length === 0) {
        console.log('param empty: trying to get from body');
        data = req.body;
    }
    // Make sure name is defined
    if (data.first_name === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('first_name must be supplied'));
    }
    if (data.last_name === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('last_name must be supplied'));
    }
    // Creating new patient.
    var newPatient = new Patients({
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
        if (error)
            return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)));
        // Send the patient if no issues
        res.send(201, result);
    });
});
// Delete patient with the given id
server.del('/patients/:id', function (req, res, next) {
    console.log('DEL request: patients/' + req.params.id);
    Patients.deleteOne({ _id: req.params.id }, function (error, result) {
        // If there are any errors, pass them to next in the correct format
        if (error)
            return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)));
        // Send a 200 OK response
        res.send(201, result);
    });
});
// Create a single record by its patient id
server.post('/patients/:id/records', function (req, res, next) {
    console.log('POST request: patients/:id/records');
    // Make sure field is defined
    if (req.params.nurse_name === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('nurse_name must be supplied'));
    }
    if (req.params.date === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('date must be supplied'));
    }
    if (req.params.time === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('time must be supplied'));
    }
    if (req.params.type === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('type must be supplied'));
    }
    if (req.params.value === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new errs.InvalidArgumentError('value must be supplied'));
    }
    // Creating new clinical data.
    var newClinicalData = new ClinicalData({
        patient_id: req.params.id,
        nurse_name: req.params.nurse_name,
        date: req.params.date,
        time: req.params.time,
        type: req.params.type,
        value: req.params.value
    });
    // Create the patient and saving to db
    newClinicalData.save(function (error, result) {
        // If there are any errors, pass them to next in the correct format
        if (error)
            return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)));
        // Send the patient if no issues
        res.send(201, result);
    });
});
// Get all the records by its patient id
server.get('/patients/:id/records', function (req, res, next) {
    console.log('GET request: patients/:id/records -' + req.params.id);
    // Find records by its id
    ClinicalData.find({ patient_id: req.params.id }).exec(function (error, record) {
        // If there are any errors, pass them to next in the correct format
        //if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))
        if (record) {
            // Send the patient if no issues
            res.send(record);
        }
        else {
            // Send 404 header if the patient doesn't exist
            res.send(404);
        }
    });
});
// Get a record by its record id
server.get('/records/:id', function (req, res, next) {
    console.log('GET request: records/:id - ' + req.params.id);
    // Find records by its id
    ClinicalData.find({ _id: req.params.id }).exec(function (error, record) {
        // If there are any errors, pass them to next in the correct format
        //if (error) return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)))
        if (record) {
            // Send the patient if no issues
            res.send(record);
        }
        else {
            // Send 404 header if the patient doesn't exist
            res.send(404);
        }
    });
});
// Update a record by its record id
server.put('/records/:id', function (req, res, next) {
    console.log('PUT records: patients/:id');
    // Creating new patient.
    var newClinicalData = new ClinicalData({
        _id: req.params.id
    });
    // Make add fields to patient data to update
    if (req.params.nurse_name !== undefined) {
        newClinicalData.nurse_name = req.params.nurse_name;
    }
    if (req.params.date !== undefined) {
        newClinicalData.date = req.params.date;
    }
    if (req.params.time !== undefined) {
        newClinicalData.time = req.params.time;
    }
    if (req.params.type !== undefined) {
        newClinicalData.type = req.params.type;
    }
    if (req.params.value !== undefined) {
        newClinicalData.value = req.params.value;
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
    ClinicalData.updateOne({ _id: req.params.id }, { $set: newClinicalData }, function (error, result) {
        // If there are any errors, pass them to next in the correct format
        if (error)
            return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)));
        // Send the patient if no issues
        res.send(201, result);
    });
});
// Delete a record with the given id
server.del('/records/:id', function (req, res, next) {
    console.log('DEL request: records/:id - ' + req.params.id);
    ClinicalData.deleteOne({ _id: req.params.id }, function (error, result) {
        // If there are any errors, pass them to next in the correct format
        if (error)
            return next(new errs.InvalidArgumentError(JSON.stringify(error.errors)));
        console.log(result);
        // Send a 200 OK response
        res.send(201, result);
    });
});
