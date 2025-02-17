// Authors: Prakeerth Regunath and Seth Clover
// ISU Netid:
// pkregu22@iastate.edu
// sclover@iastate.edu
// Date: 12/11/2024 

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 8081;
const host = "localhost";
const path = require("path");



// MongoDB setup
const url = "mongodb+srv://pkregu22:mydb2024@coms319.ao72x.mongodb.net/?retryWrites=true&w=majority&appName=COMS319";
const dbName = "secoms3190";
let db, usersCollection;



// Initialize MongoDB connection
(async () => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    db = client.db(dbName);
    usersCollection = db.collection("users");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

// Get all server data
app.get("/listall", async (req, res) => {
  try {
    const results = await db.collection("data").find({}).limit(100).toArray();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});


// Serve static images
app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/listDests", async (req, res) => {
  try {
    const results = await db.collection("data").find({}).limit(100).toArray();
    const destinations = results.flatMap((entry) => entry.destinations || []);
    res.status(200).json(destinations); // Return the array of destinations
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Signup
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: "Username and password are required." });
  }

  try {
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ error: "User already exists." });
    }

    const newUser = {
      username,
      password,
      destination: null,
      startDate: null,
      endDate: null,
      adultTickets: 0,
      childTickets: 0,
      adultCost: 0,
      childCost: 0,
      grandTotal: 0
    };
    await usersCollection.insertOne(newUser);

    res.status(201).send({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: "Username and password are required." });
  }

  try {
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(400).send({ error: "Invalid username." });
    }

    if (user.password !== password) {
      return res.status(400).send({ error: "Incorrect password." });
    }

    res.status(200).send({ message: "Login successful!" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update user destination and ticket details
app.post("/updateDestination", async (req, res) => {
  const { username, destination, adultTickets, childTickets, startDate, endDate } = req.body;

  if (!username || !destination) {
    return res.status(400).send({ error: "Username and destination are required." });
  }

  const adultPrice = 200;
  const childPrice = 150;

  try {
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    const adultCost = (adultTickets || 0) * adultPrice;
    const childCost = (childTickets || 0) * childPrice;
    const grandTotal = adultCost + childCost;

    await usersCollection.updateOne(
      { username },
      {
        $set: {
          destination,
          adultTickets: adultTickets || 0,
          childTickets: childTickets || 0,
          startDate: startDate || null,
          endDate: endDate || null,
          adultCost,
          childCost,
          grandTotal,
        },
      }
    );

    res.status(200).send({ message: "Destination and ticketing details updated successfully." });
  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get user data
app.get("/user", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send({ error: "Username is required." });
  }

  try {
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update user ticket counts dynamically
app.put("/updateUserTickets", async (req, res) => {
  const { username, adultTickets, childTickets, adultCost, childCost, grandTotal } = req.body;

  if (!username) {
    return res.status(400).send({ error: "Username is required." });
  }

  try {
    await usersCollection.updateOne(
      { username },
      {
        $set: {
          adultTickets,
          childTickets,
          adultCost,
          childCost,
          grandTotal,
        },
      }
    );

    res.status(200).send({ message: "User tickets updated successfully." });
  } catch (error) {
    console.error("Error updating user tickets:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.put("/resetUserData", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).send({ error: "Username is required." });
  }

  try {
    await usersCollection.updateOne(
      { username },
      {
        $set: {
          destination: null,
          startDate: null,
          endDate: null,
          adultTickets: 0,
          childTickets: 0,
          adultCost: 0,
          childCost: 0,
          grandTotal: 0
        },
      }
    );

    res.status(200).send({ message: "User data reset successfully." });
  } catch (error) {
    console.error("Error resetting user data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update user personal, card, and address information
app.put("/updateUserInfo", async (req, res) => {
  const { username, personalInfo, cardInfo, addressInfo } = req.body;

  if (!username) {
    return res.status(400).send({ error: "Username is required." });
  }

  try {
    await usersCollection.updateOne(
      { username },
      {
        $set: {
          personalInfo,
          cardInfo,
          addressInfo,
        },
      }
    );

    res.status(200).send({ message: "User information updated successfully." });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});



// Reset user destination to null
app.put("/updateUserDestination", async (req, res) => {
  const { username, destination } = req.body;

  if (!username) {
    return res.status(400).send({ error: "Username is required." });
  }

  try {
    await usersCollection.updateOne(
      { username },
      { $set: { destination } }
    );
    res.status(200).send({ message: "User destination reset successfully." });
  } catch (error) {
    console.error("Error resetting user destination:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update user startDate and endDate dynamically
app.put("/updateUserDates", async (req, res) => {
  const { username, startDate, endDate } = req.body;

  if (!username) {
    return res.status(400).send({ error: "Username is required." });
  }

  if (!startDate || !endDate) {
    return res.status(400).send({ error: "Both startDate and endDate are required." });
  }

  try {
    // Validate user existence
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    // Update startDate and endDate
    await usersCollection.updateOne(
      { username },
      {
        $set: {
          startDate,
          endDate,
        },
      }
    );

    res.status(200).send({ message: "User dates updated successfully." });
  } catch (error) {
    console.error("Error updating user dates:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
// Delete account route
app.delete("/deleteAccount", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).send({ error: "Username is required." });
  }

  try {
    const result = await usersCollection.deleteOne({ username });
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "User not found." });
    }
    res.status(200).send({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://${host}:${port}`);
});
