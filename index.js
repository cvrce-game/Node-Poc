import express from 'express';
import fs from 'fs';
import users from './MOCK_DATA.json' assert { type: 'json' };
import multer from 'multer';

const PORT = 3000;
const app = express();

// Configure multer to handle multipart/form-data
const upload = multer();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Get all users
app.get('/api/users', (req, res) => {
    return res.json(users);
});

// Add a new user with form data (multipart/form-data)
app.post('/api/users', upload.none(), (req, res) => {
    const body = req.body;
    
    // Basic validation
    if (!body.first_name || !body.email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUser = { id: users.length + 1, ...body };
    users.push(newUser);

    // Write updated data to the file
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (error) => {
        if (error) {
            console.error('Error writing to file:', error);
            return res.status(500).json({ error: 'Failed to update users file' });
        }
        return res.status(201).json({ status: 'User Added', id: newUser.id });
    });
});

// Route to get, update, or delete a specific user by ID
app.route('/api/users/:id')
    .get((req, res) => {
        const id = parseInt(req.params.id, 10);  // Ensure ID is a number
        const user = users.find(user => user.id === id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    })
    .put(upload.none(), (req, res) => {
        const id = parseInt(req.params.id, 10);
        const body = req.body;

        // Find user by id
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Basic validation
        if (!body.first_name || !body.email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Update the user
        users[userIndex] = { id, ...body };

        // Write updated data to the file
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (error) => {
            if (error) {
                console.error('Error writing to file:', error);
                return res.status(500).json({ error: 'Failed to update users file' });
            }
            return res.status(200).json({ status: 'User Updated', id });
        });
    })
    .delete((req, res) => {
        const id = parseInt(req.params.id, 10);

        // Find user by id
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove the user from the array
        users.splice(userIndex, 1);

        // Write updated data to the file
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (error) => {
            if (error) {
                console.error('Error writing to file:', error);
                return res.status(500).json({ error: 'Failed to update users file' });
            }
            return res.status(200).json({ status: 'User Deleted', id });
        });
    });

// About page with query params
app.get('/about', (req, res) => {
    const name = req.query.name || 'Guest';
    const age = req.query.age || 'unknown';
    res.send(`This is the About Page..!!\n Hey ${name}. You are ${age} years old.`);
});

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));