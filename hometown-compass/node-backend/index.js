var express = require('express');
const cors = require("cors");
var request = require('request');
const { XMLParser, XMLValidator} = require("fast-xml-parser");

var app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
   res.send('zr66 INFO670 Final Project (Hometown Compass) backend API. Use /feed /attractions /updatePost and /updateUserInfo endpoints');
})

const {
   dbHost,
   dbPort,
   username,
   password,
   authDatabase,
   databaseName,
   amadeusKey,
   amadeusSecret
} = require('./auth.js');

// MongoDB configuration
const { MongoClient } = require('mongodb');
const mongoUrl = `mongodb://${username}:${password}@${dbHost}:${dbPort}/${databaseName}?authSource=${authDatabase}`;

// Get a news feed for a given location
app.get('/feed', (req, res) => {
   console.debug('/news endpoint hit')
   if (!req.query.hasOwnProperty('location')) {
      if (err) {
         console.error('Missing location param in request');
         res.send(JSON.stringify({ status: 400, message: 'Missing location param in request' }));
         return;
      }
   }
   const location = req.query.location;
   console.debug(`\tsearching location ${location}`)

   var stories=[];

   // Google News API
   var url = `https://news.google.com/rss/search?q=local+news+activities+${location}&hl=en-US&gl=US&ceid=US:en&when=7d`;
   console.debug(`\tFetching ${url}`)
   request(url, (err, newsResponse, body) => {
      if (err){ console.error('\tError connecting to Google News API:', err); }

      // Parse search response
      const result = XMLValidator.validate(body);
      if (result.err) { console.error(`\tInvalid XML parsing: ${result.err.msg}`, result); }

      // Format data and send response
      if (result === true) {
         const parser = new XMLParser();
         let newsData = parser.parse(body);
         newsIDs = []
         newsData.rss.channel.item.forEach((story, index) => {
            if (index < 25) {
               stories.push({
                  'id': story.guid,
                  'title': story.title,
                  'source': story.source,
                  'location': location,
                  'pubDate': story.pubDate,
               })
               newsIDs.push(story.guid)
            }
         })
         console.log(`\t${stories.length} stories after fetching local news`)

         // Aggregate with Hometown Compass posts (or those with comments)
         // DB connection
         MongoClient.connect(mongoUrl, {useUnifiedTopology: true}, (err, client) => {
            if (err) { console.error('Error connecting to MongoDB:', err); }
            const dbo = client.db(databaseName);

            // Setup search object
            console.log(`\tSearching Hometown Compass posts in: ${location}`)
            const dbSearch = dbo.collection('hometown_posts').find({"location": location})

            // Execute database search
            dbSearch.toArray((err, posts) => {
               // Search error
               if (err) { console.error('Error finding stories:', err); }

               console.log(`\t${posts.length} Hometown Compass posts`)
               posts.forEach(post => {
                  // Replace item if found (for any posted comments)
                  let findIndex = newsIDs.findIndex((id) => id === post.id);
                  if (findIndex != -1) {
                     stories[findIndex] = post;
                  } else {
                     // Add if not already in list
                     stories.unshift(post)
                  }
               })
               
               console.log(`\t${stories.length} stories after fetching Hometown Compass posts`)

               // Send response
               res.send(JSON.stringify({
                  status: 200, 
                  stories: stories
               }));
               client.close();
            });
         });
      }
   });
});

// Find local attractions
app.get('/attractions', (req, res) => {
   console.debug('/attractions endpoint hit')
   if (!req.query.hasOwnProperty('lat') || !req.query.hasOwnProperty('lon')) {
      if (err) {
         console.error('Missing location params (lat|lon) in request');
         res.send(JSON.stringify({ status: 400, message: 'Missing location params (lat|lon) in request' }));
         return;
      }
   }

   const lat = req.query.lat;
   const lon = req.query.lon;
   const radius = req.query.radius;

   var attractions=[];

   // Amadeus - Authentication
   var url = "https://test.api.amadeus.com/v1/security/oauth2/token"
   console.debug(`\tAuthenticating ${url}`)
   request({
      uri: url,
      method: 'POST',
      headers: {'Content-Type': "application/x-www-form-urlencoded"},
      body: `grant_type=client_credentials&client_id=${amadeusKey}&client_secret=${amadeusSecret}`
   },
   (err, authResponse, body) => {
      if (err) {
         console.error('\tError authenticating to Amadeus:', err);
         res.send(JSON.stringify({
               status: 500, 
               attractions: []
         }));
         return;
      }

      bearerToken = JSON.parse(body).access_token;

      console.debug(`\tsearching location: ${lat}, ${lon} - radius ${radius}`)

      // Amadeus - Points of Interest / Activities API (Points of Interest API going through maintenance)
      //var url = `https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=${lat}&longitude=${lon}&radius=${radius}`;
      var url = `https://test.api.amadeus.com/v1/shopping/activities?latitude=${lat}&longitude=${lon}&radius=${radius}`
      console.debug(`\tFetching ${url}`)
      request({uri: url, headers: {'Authorization': `Bearer ${bearerToken}`}}, (err, attractionsResponse, body) => {
         if (err) {
            console.error('\tError connecting to Amadeus Activities API:', err);
            res.send(JSON.stringify({
                  status: 500, 
                  attractions: []
            }));
            return;
         }

         attractions = []
         attractionData = JSON.parse(body).data
         attractionData.forEach((attraction, index) => {
            if (index < 25) {
               attractions.push({
                  'id': attraction.id,
                  'name': attraction.name,
                  'description': attraction.description,
                  'pictures': attraction.pictures,
                  'price': attraction.price,
               })
            }
         })

         console.log(`\t${attractions.length} attractions after fetching activities`)

         res.send(JSON.stringify({
            status: 200, 
            attractions: attractions
         }));
      });
   });
});

// Insert/update a story
app.post('/updatePost', (req, res) => {
   console.debug('/updatePost endpoint hit')
   const storyData = req.body;
   console.debug(`\t${JSON.stringify(storyData)}`)
   if (!storyData.hasOwnProperty('title')) {
      if (err) {
         console.error('Missing "title" field in request body');
         res.send(JSON.stringify({ status: 400, message: 'Missing "title" field in request body' }));
         return;
      }
   }

   MongoClient.connect(mongoUrl, {useUnifiedTopology: true}, (err, client) => {
      if (err) {
         console.error('Error connecting to MongoDB:', err);
         res.send(JSON.stringify({ status: 500, message: 'Internal Server Error' }));
         return;
      }
      const dbo = client.db(databaseName);

      delete storyData['_id']
      dbo.collection("hometown_posts").updateOne({id: storyData.id}, {$set: storyData}, {upsert: true}, function(err, dbResponse) {
         // Insert error
         if (err) {
            console.error('Error inserting document:', storyData, err);
            res.send(JSON.stringify({ status: 404 }));
            return;
         }

         // Inserted document
         console.debug("\tDocument inserted: ", storyData);
         res.send(JSON.stringify({ status: 200 }));
         client.close();
      });   

    });
});

// Update user information
app.post('/updateUserInfo', (req, res) => {
   console.debug('/updateUserInfo endpoint hit')
   const userData = req.body;
   console.debug(`\t${JSON.stringify(userData)}`)
   if (!userData.hasOwnProperty('username')) {
      if (err) {
         console.error('Missing "username" field in request body');
         res.send(JSON.stringify({ status: 400, message: 'Missing "username" field in request body' }));
         return;
      }
   }

   MongoClient.connect(mongoUrl, {useUnifiedTopology: true}, (err, client) => {
      if (err) {
         console.error('Error connecting to MongoDB:', err);
         res.send(JSON.stringify({ status: 500, message: 'Internal Server Error' }));
         return;
      }
      const dbo = client.db(databaseName);

      // Update user information (insert if username does not exist)
      delete userData['_id']
      dbo.collection("hometown_users").updateOne({username : userData.username}, {$set: userData}, {upsert: true}, function(err, dbResponse) {
         // Insert error
         if (err) {
            console.error('Error inserting document:', userData, err);
            res.send(JSON.stringify({ status: 404 }));
            return;
         }

         // User inserted
         //console.log(dbResponse.result)
         console.debug("\tUser updated: ", userData);
         res.send(JSON.stringify({ status: 200 }));
         client.close();
      });   

    });
});

const portNum = 9331
var server = app.listen(portNum, () => {
   console.log(`Express App running at http://127.0.0.1:${portNum}`);
})
