const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
var serviceAccount = require("./colamthimoicoan-e26b9-firebase-adminsdk-mlkl6-290437f781.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://colamthimoicoan-e26b9.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();

module.exports = db;
