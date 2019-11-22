
const URL_SERVER = 'patient-data-management.herokuapp.com';

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);


var postData;

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
                postData = JSON.parse(res.text)
                expect(postData.first_name).to.equal('huen')
                expect(postData.last_name).to.equal('oh')
                expect(res.status).to.equal(201);
                done();
            });
    });
});

// Test GET /patients/:id
describe("when we issue a 'GET' to /patients/:id'", function(){
    it("should return HTTP 200", function(done) {
        chai.request(URL_SERVER)
            .get('/patients/' + postData._id)
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
            .put('/patients/' + postData._id)
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
            .delete('/patients/' + postData._id)
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