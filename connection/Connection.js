import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const uri = process.env.MONGODB_URI;  // MongoDB URI from .env file

// Create MongoClient instance (but don't connect yet)
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let dbInstance = null;  // Will hold the MongoDB database instance
let usersCollection = null;  // Will hold the users collection instance
let isConnected = false;  // Flag to track connection status

// Singleton function to connect to MongoDB
async function connectToMongoDB() {
    // If already connected, return the existing connection
    if (isConnected && dbInstance) {
        console.log('Using existing MongoDB connection.');
        return dbInstance;
    }

    try {
        await client.connect();  // Establish connection if not already connected
        dbInstance = client.db('sample_mflix');  // Store the DB instance
        usersCollection = dbInstance.collection('users');  // Store the users collection
        isConnected = true;  // Set the flag to true to prevent reconnection
        console.log('Connected to MongoDB!');
        return dbInstance;  // Return the connected DB instance
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;  // Re-throw the error to handle it in calling code
    }
}

// Function to get the usersCollection after connection
function getUsersCollection() {
    if (!usersCollection) {
        throw new Error('MongoDB not connected yet. Please wait for the connection.');
    }
    return usersCollection;  // Return the users collection
}

// Export the singleton connection function and the getter for usersCollection
export { connectToMongoDB, getUsersCollection };