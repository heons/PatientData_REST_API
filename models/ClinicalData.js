const mongoose = require('mongoose');

// TODO : Check types, validation.
const ClinicalDataSchema = new mongoose.Schema({
    patient_id: String,
    nurse_name: String,
    date: String, 
    time: String, 
    type: String,
    value: String
});

module.exports = mongoose.model('ClinicalData', ClinicalDataSchema);