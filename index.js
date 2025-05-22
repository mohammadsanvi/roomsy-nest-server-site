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
    // console.log("✅ Connected to MongoDB");

    const database = client.db(dbName);
    const usersCollection = database.collection("users");
    const roommateListingsCollection = database.collection("posts");

    // === Routes ===

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
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (!user) return res.status(404).send({ error: "User not found" });
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

    // Create a new roommate listing
    app.post("/roommate-listings", async (req, res) => {
      try {
        const listData = req.body;
        const result = await roommateListingsCollection.insertOne(listData);
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to create listing" });
      }
    });

    // Get all roommate listings
    app.get("/roommate-listings", async (req, res) => {
      try {
        const listings = await roommateListingsCollection.find().toArray();
        res.send(listings);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch listings" });
      }
    });

    // Get listings by user email
    app.get("/my-listings", async (req, res) => {
      const userEmail = req.query.email;
      try {
        const listings = await roommateListingsCollection
          .find({ userEmail })
          .toArray();
        res.send(listings);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch listings" });
      }
    });

    // Get single listing by ID
    app.get("/roommate-listings/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const listing = await roommateListingsCollection.findOne({ _id: new ObjectId(id) });
        if (!listing) return res.status(404).send({ error: "Listing not found" });
        res.send(listing);
      } catch (err) {
        res.status(500).send({ error: "Invalid ID format" });
      }
    });

    // Update listing by ID
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

    // Delete listing by ID
    app.delete("/roommate-listings/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await roommateListingsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).send({ error: "Listing not found" });
        }
        res.send({ message: "Listing deleted successfully" });
      } catch (err) {
        res.status(500).send({ error: "Failed to delete listing" });
      }
    });

    // PUT route to update likes directly
    app.put("/listings/:id", async (req, res) => {
      const id = req.params.id;
      const { likes } = req.body;
      try {
        const result = await roommateListingsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { likes } }
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Update failed", error });
      }
    });

     app.get("/featured-roommates", async (req, res) => {
  try {
    const posts = await roommateListingsCollection
      .find({ availability: "Available" })
      .limit(6)
      .toArray();

    res.json(posts);
  } catch (error) {
    console.error("❌ Error fetching featured roommates:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

    // PATCH route to increment likes
  app.patch("/listings/:id/like", async (req, res) => {
  const listingId = req.params.id;

  try {
    await roommateListingsCollection.updateOne(
      { _id: new ObjectId(listingId) },
      { $inc: { likes: 1 } }
    );

    const updated = await roommateListingsCollection.findOne({
      _id: new ObjectId(listingId),
    });

    res.status(200).json({ likes: updated.likes });
  } catch (err) {
    console.error("Error updating like:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
  }

}


runServer().catch(console.dir);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});