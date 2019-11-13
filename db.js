const mongoose = require('mongoose');
//const DEFAULT_MONGODB_URI = 'mongodb://localhost/healthrecords-db' // Default MongoDB URI
const DEFAULT_MONGODB_URI = 'mongodb://dbAdmin:dbAdminPassword@cluster0-shard-00-00-axk6x.mongodb.net:27017,cluster0-shard-00-01-axk6x.mongodb.net:27017,cluster0-shard-00-02-axk6x.mongodb.net:27017/health_records?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'; // atlas
//mongoose.Promise = global.Promise;

// Assign URI string to connect the database. Default is DEFAULT_MONGODB_URI
const dbURI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

// to check connectivity
let isConnected;

// Connect to the database
module.exports = connectToDatabase = () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  return mongoose.connect(dbURI)
    .then(db => { 
      isConnected = db.connections[0].readyState;
      console.log ('Successfully connected to: ' + dbURI + ' - ' + isConnected);
    })
    .catch(err => {
      console.log ('ERROR connecting to: ' + dbURI + '. ' + err);
    });
};