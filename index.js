const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient } = require("mongodb");
const objectId = require("mongodb").ObjectId;
const cors = require("cors");

// MiddleWare
app.use(cors());
app.use(express.json());

// Database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4b6iz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Run Function
async function run() {
  try {
    await client.connect();
    const database = client.db("FHInfoManagement");

    // Collection
    const HRServerPCInfoCollection = database.collection("HRServerPCInfo");

    ///// HR Server PC IP Info //////

    // Get IP List
    app.get("/ipList", async (req, res) => {
      const cursor = HRServerPCInfoCollection.find({});
      const ipList = await cursor.toArray();
      console.log("hitting in ipList");
      res.send(ipList);
    });
  } finally {
    //await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("I am from server");
});

app.listen(port, () => {
  console.log("Listening PORT: " + port);
});
