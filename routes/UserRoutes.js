import express from 'express';
import multer from 'multer';
import { addUser, findOneUser, getAllUsers, updateUser, deleteUser } from '../service/UserService.js';

const router = express.Router();
const upload = multer(); // Assuming multer is initialized like this

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Add a new user
router.post('/', upload.none(), async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'First name and email are required' });
    }

    try {
        const result = await addUser({ name, email, password });
        if (result)
            res.status(201).json({ status: 'User Added', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add user =>'+ error });
    }
});

// Get, update, and delete user by ID
router.route('/:id')
    .get(async (req, res) => {
        const id = req.params.id;
        try {
            const user = await findOneUser(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching user =>'+ error });
        }
    })
    .put(upload.none(), async (req, res) => {
        const id = req.params.id;
        const { name, email, password } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        try {
            const updatedUser = await updateUser(id, { name, email, password });
            if (updatedUser.matchedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ status: 'User Updated' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update user =>'+ error  });
        }
    })
    .delete(async (req, res) => {
        const id = req.params.id;
        try {
            const deletedUser = await deleteUser(id);
            if (deletedUser.deletedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ status: 'User Deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete user =>'+ error  });
        }
    });

// About page
router.get('/about', (req, res) => {
    const name = req.query.name || 'Guest';
    const age = req.query.age || 'unknown';
    res.send(`This is the About Page..!!\n Hey ${name}. You are ${age} years old.`);
});

// Exporting the router
export default router;