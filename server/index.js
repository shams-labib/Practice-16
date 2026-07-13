const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const bcrypt = require("bcryptjs");

app.use(cors());
app.use(express.json());
dotenv.config();

const uri =
  "mongodb+srv://practice-next-auth:PDOui2eRBKZuihaY@cluster0.gs1mqwb.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    // main kaj ekhane hobe
    const database = client.db("next-auth-db");
    // ekhane collection gulo thakbe amar joyta collection hobe ekhane theke create korbo
    const userCollection = database.collection("users");

    // So let's start for user post function boobie

    app.post("/users", async (req, res) => {
      const user = req.body;
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      const result = await userCollection.insertOne(user);

      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // login logic
    app.post("/login", async (req, res) => {
      const { email } = req.body;

      const user = await userCollection.findOne({ email });

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }

      res.send(user);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);

// server shot
app.get("/", (req, res) => {
  res.send("Server coltese bhai aaaaa...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
