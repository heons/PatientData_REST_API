

/*------ Basic constant values for the server ------*/
let SERVER_NAME = 'healthrecords'   // Server name
let DEFAULT_PORT = 5000             // Default port number
let DEFAULT_HOST = '127.0.0.1'      // Default IP address
let DEFAULT_MONGODB_URI = 'mongodb://localhost/healthrecords-db' // Default MongoDB URI


/*------ Requirements ------*/
var mongoose = require ("mongoose") // Mongo DB
var restify = require('restify')    // REST


/*------ Assign values for the DB connection ------*/
// Assign port value
var port = process.env.PORT;
if (typeof port === "undefined") {
	console.warn('No process.env.PORT var, using default port: ' + DEFAULT_PORT);
	port = DEFAULT_PORT;
};
  
// Assign ip address value
var ipaddress = process.env.IP; // TODO: figure out which IP to use for the heroku
if (typeof ipaddress === "undefined") {
	//  Log errors on OpenShift but continue w/ 127.0.0.1 - this
	//  allows us to run/test the app locally.
	console.warn('No process.env.IP var, using default: ' + DEFAULT_HOST);
	ipaddress = DEFAULT_HOST;
};

// Assign URI string to connect the database. Default is DEFAULT_MONGODB_URI
var uristring = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;


/*------ MongoDB ------*/
// This is the schema of the Patient. 
// TODO : Check types, validation.
var patientSchema = new mongoose.Schema({
    first_name: String, 
    last_name: String, 
    address: String,
    sex: String,
    date_of_birth: String,
    department: String,
    doctor: String
});

// Connect to the MongoDB
mongoose.connect(uristring, function (err, res) {
    if (err) { 
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Successfully connected to: ' + uristring);
    }
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'Patients' collection in the MongoDB database
var Patient = mongoose.model('Patients', patientSchema);


/*------ Sever implementation ------*/
// Create the restify server
server = restify.createServer({ name: SERVER_NAME})
server
    // Allow the use of POST
    .use(restify.plugins.fullResponse())

    // Maps req.body to req.params so there is no switching between them
    .use(restify.plugins.bodyParser())
 
// Start listening
server.listen(port, ipaddress, function () {
    console.log('Server %s listening at %s', server.name, server.url)
    console.log('Resources:')
    console.log(' /patient')
    console.log(' /patient/:id')
})


// Get all patients in the system
server.get('/patient', function (req, res, next) {
    console.log('GET request: patient');
    // Find every entity within the given collection
    Patient.find({}).exec(function (error, result) {
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
        res.send(result);
    });
})


// Get a single patient by their patient id
server.get('/patient/:id', function (req, res, next) {
    console.log('GET request: patient/' + req.params.id);

    // Find a single patient by their id
    Patient.find({ _id: req.params.id }).exec(function (error, patient) {
      // If there are any errors, pass them to next in the correct format
      //if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        if (patient) {
            // Send the patient if no issues
            res.send(patient)
        } else {
            // Send 404 header if the patient doesn't exist
            res.send(404)
        }
    })
})


// Create a new patient
server.post('/patient', function (req, res, next) {
    console.log('POST request: patient');
    // Make sure name is defined
    if (req.params.first_name === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('first_name must be supplied'))
    }
    if (req.params.last_name === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('last_name must be supplied'))
    }

    // Creating new patient.
    var newPatient = new Patient({
        first_name: req.params.first_name,
        last_name: req.params.last_name,
        address: req.params.address,
        sex: req.params.sex,
        date_of_birth: req.params.date_of_birth,
        department: req.params.department,
        doctor: req.params.doctor
    });


    // Create the patient and saving to db
    newPatient.save(function (error, result) {
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send the patient if no issues
        res.send(201, result)
        })
})


// Delete patient with the given id
server.del('/patient/:id', function (req, res, next) {
    console.log('DEL request: patient/' + req.params.id);
    Patient.remove({ _id: req.params.id }, function (error, result) {
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send a 200 OK response
        res.send()
    });
})