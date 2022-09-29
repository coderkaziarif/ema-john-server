const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const multer = require('multer');
// const forms = multer();
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qw3jyed.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const app = express();

app.use(bodyParser.json());
app.use(cors());
// app.use(forms.array()); 
// app.use(bodyParser.urlencoded({ extended: true }));


// client.connect(err => {
//   const products = client.db("emaJohnStore").collection("products");
//   console.log("Database Connected");

// // Add product to Database//
// app.post('/addProduct', (req, res) => {
//    const product = req.body;
//    // console.log(product);
//     products.insertOne(product)
//    .then(result => {
//       console.log(result);
//    })
// })
//    client.close();
// });

// New Code for database  //
async function run() {
   try {
      await client.connect();
      // database and collection code goes here
      const products = client.db("emaJohnStore").collection("products");
      const orders = client.db("emaJohnStore").collection("orders");
      console.log("Database Connected");
      // product code send to database//
      app.post('/addProduct', (req, res) => {
         const product = req.body;
         // console.log(product);
         products.insertMany(product)
         .then(result => {
            // console.log(result.insertedCount);
            res.sendStatus(result.insertedCount)
         })
      })
      // Data send to Home page//
      app.get('/products', (req,res) => {
         products.find({}).limit(10)
         .toArray((err, documents) =>{
            res.send(documents);
         })
         
      })
        // product key send to productDetail page//
        app.get('/product/:key', (req,res) => {
         products.find({key: req.params.key})
         .toArray((err, documents) =>{
            res.send(documents[0]);
         })
         
      })
       // product key send to database & Review page//
       app.post('/productWithKeys', (req,res) => {
         const productKeys = req.body;
         products.find({key: {$in : productKeys}})
         .toArray((err, documents) =>{
            res.send(documents);
         })
         
      })
       // Order send to database//
       app.post('/addOrder', async (req, res) => {
         const order = await req.body;
         // console.log(product);
         orders.insertOne(order)
         .then(result => {
            console.log('Order Send To Database');
            console.log(result);
            res.send(result.acknowledged == true)
         })
      })
    
   } finally {
   //   Ensures that the client will close when you finish/error
   //   await client.close();
   }
 }
 run().catch(console.dir);



app.listen(4000, () => {
   console.log('server is active on 4000');
})