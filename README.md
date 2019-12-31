# PatientData_REST_API

Patients and their record(clinical data) management server & web application. It is a term project of MAPD713 class @ Centennial College. 
* Tech stacks : Javascript, Typescript, html, css, Ajax, Node.js, Restful, JWT, MongoDB.
* MongoDB is deployed in [MongoDB Atlas](https://www.mongodb.com/cloud).
* Server is deployed in [Heroku](https://www.heroku.com).
* [Swagger Endpoint API](https://app.swaggerhub.com/apis-docs/heons/patient-data-management/1.0.0).
* [Web Entry Point](https://heons.github.io/PatientData_REST_API/web//Login.html) : Username(jack00@gmail.com), Password(jack00).

## Getting Started

To start with demo, go to [Swagger Endpoint API](https://app.swaggerhub.com/apis-docs/heons/patient-data-management/1.0.0) for the backend and go to [Web Entry Point](https://heons.github.io/PatientData_REST_API/web//Login.html) for the frontend.

### Prerequisites
* It requires proper environment settings for Javascript and Node.js first.
* Install npm packages.
```
npm install mongoose
npm install jsonwebtoken
npm install restify
npm install restify-errors
npm install restify-cors-middleware --save
```

* (Optional)To MongoDB locally, [Install MongoDB](https://docs.mongodb.com/manual/installation/) and change DEFAULT_MONGODB_URI in ./db.js.
```
const DEFAULT_MONGODB_URI = 'mongodb://localhost/healthrecords-db' // Default MongoDB URI
```

* (Optional)To use typescrpt, [Install Typescript](https://www.typescriptlang.org/#download-links). It is not required since you could make changes in ./index.js directly.


## Running the tests


Explain how to run the automated tests for this system


### Running

* Run the sever locally
```
node index.js
```

* Access to the web page by './web/Login.html'

### Automatic endpoint testing

* Install npm packages

```
npm install mocha
npm install chai
npm install chai-http
```

* Run with mocha

```
mocha chai-http-tests.js 
```

## Authors

* **Huen Oh** - *Initial work* - [heons](https://github.com/heons)
* **Loveleen** - *Responsive web design* - [loveleenkaur598](https://github.com/loveleenkaur598)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* etc
