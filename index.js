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
var patientsHandler = require("./controllers/patientsController");
// Get all patients in the system
server.get('/patients', patientsHandler.get_all_patients);
// Get a single patient by their patient id
server.get('/patients/:id', patientsHandler.get_a_patient_by_id);
// Update a single patient by its patient id
server.put('/patients/:id', patientsHandler.update_a_patient_by_id);
// Create a new patient
server.post('/patients', patientsHandler.create_a_patient);
// Delete patient with the given id
server.del('/patients/:id', patientsHandler.delete_a_patient_by_id);
var clinicalDataHandler = require("./controllers/clinicalDataController");
// Get all the records by its patient id
server.get('/patients/:id/records', clinicalDataHandler.get_all_records_by_patient_id);
// Create a single record by its patient id
server.post('/patients/:id/records', clinicalDataHandler.create_a_record_by_patient_id);
// Get a record by its record id
server.get('/records/:id', clinicalDataHandler.get_a_record_by_id);
// Update a record by its record id
server.put('/records/:id', clinicalDataHandler.update_a_record_by_id);
// Delete a record with the given id
server.del('/records/:id', clinicalDataHandler.delete_a_record_by_id);
server.get('/', function (req, res, next) { res.send(200); });
var http = require("http");
setInterval(function () {
    http.get("https://patient-data-management.herokuapp.com");
}, 300000);
