var express = require('express');
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:8081",
};
var app = express();
app.use(cors());

app.get('/', function (req, res) {
   res.send('zr66 INFO670 Assignment 4 backend API. Use /messages or /newMessage endpoints');
})

const { dbHost, dbPort, username, password, authDatabase, databaseName } = require('./auth.js');

// MongoDB configuration
const { MongoClient } = require('mongodb');
const url = `mongodb://${username}:${password}@${dbHost}:${dbPort}/${databaseName}?authSource=${authDatabase}`;

// Find messages optionally filtered by tags
app.get('/messages', function (req, res) {
   console.debug('/messages endpoint hit')
   const tagStr = req.query.tags;

   // DB connection
   MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
      if (err) {
         console.error('Error connecting to MongoDB:', err);
         res.send(JSON.stringify({
               status: 500, 
               students: []
         }));
         return;
      }
      const dbo = client.db(databaseName);

      // Setup search object
      var dbSearch = undefined;
      if (tagStr) {
         tagFilter = tagStr.split(',')
         console.debug(`\tfiltering by tags: ${tagFilter}`)
         dbSearch = dbo.collection('messages').find({"tags": {$in: tagFilter}})
      }
      else {
         dbSearch = dbo.collection('messages').find({})
      }

      // Execute database search
      dbSearch.toArray((err, messages) => {
         // Search error
         if (err) {
               console.error('Error finding document:', err);
               res.send(JSON.stringify({
                  status: 404, 
                  messages: []
               }));
               return;
         }

         // Search response
         res.send(JSON.stringify({
               status: 200, 
               messages: messages
         }));
         client.close();
         return
      });
   });
});

// Insert new message
app.use(express.json());
app.post('/newMessage', function (req, res) {
   console.debug('/newMessage endpoint hit')
   const messageData = req.body;
   console.debug(`\t${JSON.stringify(messageData)}`)
   if (!messageData.hasOwnProperty('message')) {
      if (err) {
         console.error('Missing "message" field in request body:');
         res.send(JSON.stringify({ status: 500, message: 'Request body must include a "message" field' }));
         return;
      }
   }

   MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
      if (err) {
         console.error('Error connecting to MongoDB:', err);
         res.send(JSON.stringify({
               status: 500, 
               students: []
         }));
         return;
      }
      const dbo = client.db(databaseName);

      dbo.collection("messages").insertOne(messageData, function(err, dbResponse) {
         // Insert error
         if (err) {
            console.error('Error inserting document:', messageData, err);
            res.send(JSON.stringify({ status: 404 }));
            return;
         }

         // Inserted document
         //console.debug(dbResponse)
         console.debug("\tDocument inserted: ", messageData);
         res.send(JSON.stringify({ status: 200 }));
         client.close();
      });   

    });
});

const portNum = 9331
var server = app.listen(portNum, function () {
   console.log(`Express App running at http://127.0.0.1:${portNum}`);
})
