
const URL_SERVER = 'patient-data-management.herokuapp.com';
//const URL_SERVER = '127.0.0.1:5000';

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);


var postPatientData;

// Test GET /patients
describe("when we issue a 'GET' to /patients'", function(){
    it("should return HTTP 200", function(done) {
        chai.request(URL_SERVER)
            .get('/patients')
            .query({}).end(function(req, res){
                //console.log(JSON.stringify(res));
                expect(res.status).to.equal(200);
                done();
            });
    });
});

// Test POST /patients
describe("when we issue a 'POST' to /patients'", function(){
    it("should return HTTP 201", function(done) {
        chai.request(URL_SERVER)
            .post('/patients')
            .send({first_name:'huen', last_name:'oh'})
            .end(function(req, res){
                postPatientData = JSON.parse(res.text)
                expect(postPatientData.first_name).to.equal('huen')
                expect(postPatientData.last_name).to.equal('oh')
                expect(res.status).to.equal(201);
                done();
            });
    });
});

// Test GET /patients/:id
describe("when we issue a 'GET' to /patients/:id'", function(){
    it("should return HTTP 200", function(done) {
        chai.request(URL_SERVER)
            .get('/patients/' + postPatientData._id)
            .end(function(req, res){
                //console.log(JSON.parse(res.text))
                expect(res.status).to.equal(200)
                done();
            });
    });
});

// Test PUT /patients/:id
describe("when we issue a 'PUT' to /patients/:id'", function(){
    it("should return HTTP 201", function(done) {
        chai.request(URL_SERVER)
            .put('/patients/' + postPatientData._id)
            .send({first_name:'huen_put', last_name:'oh_put'})
            .end(function(req, res){
                console.log(JSON.parse(res.text))  
                expect(JSON.parse(res.text).nModified).to.equal(1)        
                expect(res.status).to.equal(201)
                done();
            });
    });
});

// Test DELETE /patients/:id
describe("when we issue a 'PUT' to /patients/:id'", function(){
    it("should return HTTP 201", function(done) {
        chai.request(URL_SERVER)
            .delete('/patients/' + postPatientData._id)
            .end(function(req, res){
                console.log(JSON.parse(res.text))   
                expect(JSON.parse(res.text).deletedCount).to.equal(1)       
                expect(res.status).to.equal(201)
                done();
            });
    });
});

/*
chai.request('http://mydomain.com')
  .post('/myform')
  .field('_method', 'put')
  .field('username', 'dgonzalez')
  .field('password', '123456').end(...)
*/