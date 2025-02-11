import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email is missing
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Check if password is missing
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if email already exists in the database
    const usersCollection = dbClient.client.db().collection('users');
    const userExists = await usersCollection.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = sha1(password);

    // Create a new user object
    const newUser = {
      email,
      password: hashedPassword,
    };

    // Insert the new user into the database
    const result = await usersCollection.insertOne(newUser);

    // Return the new user with only email and id
    return res.status(201).json({
      id: result.insertedId,
      email,
    });
  }
}

export default UsersController;
