const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Environment variables
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const dbName = "rommsyNestDB";


// mongodb uri
const uri = `mongodb+srv://${user}:${pass}@cluster0.nhr7u6w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    await client.connect();
      const database = client.db(dbName);
    //   db collection
      const usersCollection = database.collection("roomsynest");

    

      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

// Root route
app.get("/", (req, res) => {
  res.send("Rommsy Nest Server is Now running!");
});

// Server start
app.listen(port, () => {
    console.log('server is serterted')
});