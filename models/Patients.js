const mongoose = require('mongoose');

// TODO : Check types, validation.
const PatientSchema = new mongoose.Schema({
  first_name: String, 
  last_name: String, 
  address: String,
  sex: String,
  date_of_birth: String,
  department: String,
  doctor: String
});

module.exports = mongoose.model('Patients', PatientSchema);