const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
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
    const database = client.db("Bulk");

    // Collection
    const HRServerPCInfoCollection = database.collection("Software_IPList");

    ///// HR Server PC IP Info //////

    // Get IP List
    app.get("/ipList", async (req, res) => {
      const cursor = HRServerPCInfoCollection.find({});
      const ipList = await cursor.toArray();
      console.log("hitting in ipList");
      res.send(ipList);
    });

    // Post Single IP List
    app.post("/ipList/add", async (req, res) => {
      const singleIP = req.body;
      console.log(singleIP);
      const result = await HRServerPCInfoCollection.insertOne(singleIP);
      res.json(result);
    });

    // Delete Single IP From List

    app.delete("/ipList/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await HRServerPCInfoCollection.deleteOne(query);
      res.json(result);
    });

    ////
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
