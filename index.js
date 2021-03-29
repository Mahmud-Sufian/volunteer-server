// server site link :  https://peaceful-atoll-11025.herokuapp.com/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwgr6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

 
app.get('/', (req, res) => {
  res.send('Hello World!')
})



client.connect(err => {
    const eventCollection = client.db("volunteer").collection("event");

    app.get('/events', (req, res) => {
      // eventCollection.find({email: req.query.email})
      eventCollection.find({})
      .toArray( (err, document) => {
        res.send(document); 
      })
    })

    app.post('/addEvent', (req, res) => {
        const event = req.body;
        eventCollection.insertOne(event)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.delete('/delete/:id', (req, res) => {
      // const id = ObjectId(req.params.id);
      eventCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
         res.send(result.deletedCount > 0);
      })
    })
     
  });





app.listen(process.env.PORT || 5055, () =>   console.log(`this port is running`))