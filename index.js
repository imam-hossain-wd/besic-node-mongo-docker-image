// Import required modules
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let db;

// Connect to MongoDB
MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db(dbName);
    console.log('MongoDB connected...');
});

// Routes
// Get all items
app.get('/items', async (req, res) => {
    try {
        const items = await db.collection('items').find().toArray();
        res.json(items);
    } catch (err) {
        res.status(500).send(err);
    }
});
app.get('/', async (req, res) => {
    try {
        const items= {
            message:"Hellow world.....i am here"
        }
        res.json(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a single item by id
app.get('/items/:id', async (req, res) => {
    try {
        const item = await db.collection('items').findOne({ _id: new ObjectId(req.params.id) });
        if (!item) return res.status(404).send('Item not found');
        res.json(item);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Create a new item
app.post('/items', async (req, res) => {
    const newItem = {
        name: req.body.name,
        quantity: req.body.quantity
    };
    try {
        const result = await db.collection('items').insertOne(newItem);
        res.status(201).json(result.ops[0]);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update an item by id
app.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = {
            name: req.body.name,
            quantity: req.body.quantity
        };
        const result = await db.collection('items').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedItem }
        );
        if (result.matchedCount === 0) return res.status(404).send('Item not found');
        res.json(updatedItem);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete an item by id
app.delete('/items/:id', async (req, res) => {
    try {
        const result = await db.collection('items').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).send('Item not found');
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
