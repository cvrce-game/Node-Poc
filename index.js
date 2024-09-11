import express from 'express';
import multer from 'multer';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 3000;
const app = express();

// MongoDB Connection URI
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Multer middleware to handle form-data
const upload = multer();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Custom middlewares
app.use((req, res, next) => {
    req.userName = 'Papun';
    console.log('Middleware 1 Testing:', req.userName);
    next();
});

app.use((req, res, next) => {
    req.Password = 'xyz';
    console.log('Middleware 2 Testing:', req.userName);
    next();
});


// Function to connect to MongoDB and store the collection globally
let usersCollection;

async function connectToMongoDB() {
    try {
        await client.connect();
        const db = client.db('sample_mflix'); // Replace with your DB name
        usersCollection = db.collection('users'); // Store collection reference globally
        console.log('Connected to MongoDB!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Connect to MongoDB when the server starts
connectToMongoDB();

// Routes can be defined outside of the database connection method

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await usersCollection.find({}).toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Add a new user
app.post('/api/users', upload.none(), async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'First name and email are required' });
    }

    try {
        const newUser = { name, email, password };
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ status: 'User Added', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add user' });
    }
});

// Get, update, and delete user by ID
app.route('/api/users/:id')
    .get(async (req, res) => {
        const id = req.params.id;
        try {
            const user = await usersCollection.findOne({ _id: new ObjectId(id) });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching user' });
        }
    })
    .put(upload.none(), async (req, res) => {
        const id = req.params.id;
        const { name, email, password } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        try {
            const updatedUser = await usersCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { name, email, password } }
            );
            if (updatedUser.matchedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ status: 'User Updated' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update user' });
        }
    })
    .delete(async (req, res) => {
        const id = req.params.id;
        try {
            const deletedUser = await usersCollection.deleteOne({ _id: new ObjectId(id) });
            if (deletedUser.deletedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ status: 'User Deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    });

// About page
app.get('/about', (req, res) => {
    const name = req.query.name || 'Guest';
    const age = req.query.age || 'unknown';
    res.send(`This is the About Page..!!\n Hey ${name}. You are ${age} years old.`);
});

// Start the server after connecting to MongoDB
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});