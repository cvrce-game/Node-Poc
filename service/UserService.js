import { getUsersCollection } from '../connection/Connection.js';
import { ObjectId } from 'mongodb'; // Assuming ObjectId is imported like this

async function getAllUsers() {
    try {
        const usersCollection = getUsersCollection();  // Ensure MongoDB is connected before accessing
        const users = await usersCollection.find({}).toArray();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
        // Handle the error accordingly (e.g., return an error message or throw the error)
    }

}

async function addUser(User) {
    try {
        const { name, email, password } = User;
        const usersCollection = getUsersCollection();  // Ensure MongoDB is connected before accessing
        const newUser = { name, email, password };
        const result = await usersCollection.insertOne(newUser);
        return result;
    } catch (error) {

        console.error('Error adding users:', error);
        throw error;
    }

}

async function findOneUser(id) {
    try {
        const usersCollection = getUsersCollection();  // Ensure MongoDB is connected before accessing
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }

}

async function updateUser(id, User) {
    try {
        const { name, email, password } = User;
        const usersCollection = getUsersCollection();  // Ensure MongoDB is connected before accessing
        const updatedUser = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { name, email, password } }
        );
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

async function deleteUser(id) {
    try {
        const usersCollection = getUsersCollection();  // Ensure MongoDB is connected before accessing
        const deletedUser = await usersCollection.deleteOne({ _id: new ObjectId(id) });
        return deletedUser;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

// Named Export
export { getAllUsers, addUser, findOneUser, updateUser, deleteUser };