
// Bring in our dependencies
const
  app        = require('express')(),
  bodyParser = require('body-parser'),
  routes     = require('./routes'),
  mongo      = require('mongodb').MongoClient,
  objectID   = require('mongodb').ObjectID,
  PORT       = process.env.PORT || 3000,
  mongoUrl   = process.env.MONGOURL || 'mongodb://localhost:27017/heady';

mongo.connect(mongoUrl, function (err, db) {
  if (err) {
    console.log(err);
  }

  global.mongoClient = db;
  global.objectID    = objectID;
  global.productDB   = process.env.productDB || 'product';
  global.categoryDB  = process.env.categoryDB || 'categories';
});
app.use(bodyParser.json());
//  Connect all our routes to our application
app.use('/', routes);

// Turn on that server!
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
