const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const uri = 'mongodb+srv://yashdarshankar:Yash%401001@cluster0.gto09ok.mongodb.net/mernstack?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongoDB();

app.get('/api/qrcodesfetch', async (req, res) => {
  try {
    const db = client.db('mernstack');
    const qrCodeCollection = db.collection('temp');
    const data = await qrCodeCollection.find({}).toArray();
    console.log("fetched the data", data)
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving data' });
  }
});

app.post('/api/qrcodes', async (req, res) => {
  try {
    const db = client.db('mernstack');
    const qrCodeCollection = db.collection('temp');
    const { content } = req.body;
    const result = await qrCodeCollection.insertOne({ content });
    console.log("posted the data")
    res.json({ success: true, id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Error saving data' });
  }
});

app.delete('/api/qrcodesdelete', async (req, res) => {
  try {
    const db = client.db('mernstack');
    const qrCodeCollection = db.collection('temp');


    const result = await qrCodeCollection.deleteMany({});

    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} QR codes`);
      res.json({ success: true, message: `Deleted ${result.deletedCount} QR codes` });
    } else {
      res.json({ success: false, message: 'No QR codes found to delete' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting data' });
  }
});


app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
