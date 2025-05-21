const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// === Middlewares ===
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

// === MongoDB Configuration ===
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const dbName = "rommsyNestDB";
const uri = `mongodb+srv://${user}:${pass}@cluster0.nhr7u6w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// === MongoDB Client Setup ===
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function runServer() {
  try {
    // await client.connect();
    console.log("✅ Connected to MongoDB");

    const database = client.db(dbName);
    const usersCollection = database.collection("users");
    const roommateListingsCollection = database.collection("posts");

    // === Routes ===

    // Root route
    app.get("/", (req, res) => {
      res.send("Rommsy Nest Server is Now Running!");
    });

    // Get all users
    app.get("/users", async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();
        res.send(users);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch users." });
      }
    });

    // Get user by ID
    app.get("/users/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const user = await usersCollection.findOne(query);
        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }
        res.send(user);
      } catch (err) {
        res.status(500).send({ error: "Invalid ID format" });
      }
    });

    // Create new user
    app.post("/users", async (req, res) => {
      try {
        const userData = req.body;
        const result = await usersCollection.insertOne(userData);
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to create user" });
      }
    });

    // USERS POST API
    app.post("/roommate-listings", async (req, res) => {
      try {
        const listData = req.body;
        const result = await roommateListingsCollection.insertOne(listData);
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to listing" });
      }
    });

    // get all listing

    app.get("/roommate-listings", async (req, res) => {
      try {
        const result = await roommateListingsCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to get user" });
      }
    });

    // get user by email

    app.get("/my-listings", async (req, res) => {
      const userEmail = req.query.email;

      try {
        const listings = await roommateListingsCollection
          .find({ userEmail: userEmail })
          .toArray();

        res.send(listings);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch listings" });
      }
    });

    // Delete user

    app.delete("/roommate-listings/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const result = await roommateListingsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).send({ error: "Listing not found" });
        }
        res.send({ message: "Listing deleted successfully" });
      } catch (err) {
        res.status(500).send({ error: "Failed to delete listing" });
      }
    });


    // Get user by ID
    app.get("/roommate-listings/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const user = await roommateListingsCollection.findOne(query);
        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }
        res.send(user);
      } catch (err) {
        res.status(500).send({ error: "Invalid ID format" });
      }
    });

    // Update a listing by ID
    app.put("/roommate-listings/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      try {
        const result = await roommateListingsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ error: "Listing not found" });
        }

        res.send({ message: "Listing updated successfully" });
      } catch (err) {
        res.status(500).send({ error: "Failed to update listing" });
      }
    });
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
  }
}

// Run server connection
runServer().catch(console.dir);

// === Start Server ===
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
