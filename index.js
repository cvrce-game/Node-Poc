import express from 'express';
import { connectToMongoDB } from './connection/Connection.js'
import UserRouter from './routes/UserRoutes.js'

const PORT = 3000;
const app = express();


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
connectToMongoDB();

app.use('/api/users', UserRouter)


// Start the server after connecting to MongoDB
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});