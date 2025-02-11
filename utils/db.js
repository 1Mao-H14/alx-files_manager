import mongodb from 'mongodb';
// eslint-disable-next-line no-unused-vars
import Collection from 'mongodb/lib/collection';
import envLoader from './env_loader';

/**
 * A MongoDB client for interacting with the database.
 */
class DBClient {
  /**
   * Initializes a new instance of the DBClient.
   * Loads environment variables and establishes a connection to the MongoDB server.
   */
  constructor() {
    envLoader();
    const dbHost = process.env.DB_HOST || 'localhost'; // Database host (default: localhost)
    const dbPort = process.env.DB_PORT || 27017; // Database port (default: 27017)
    const dbName = process.env.DB_DATABASE || 'files_manager'; // Database name (default: files_manager)
    const connectionString = `mongodb://${dbHost}:${dbPort}/${dbName}`; // MongoDB connection string

    this.dbClient = new mongodb.MongoClient(connectionString, { useUnifiedTopology: true });
    this.dbClient.connect(); // Connect to the MongoDB server
  }

  /**
   * Checks if the connection to the MongoDB server is active.
   * @returns {boolean} True if connected, otherwise false.
   */
  isAlive() {
    return this.dbClient.isConnected();
  }

  /**
   * Retrieves the total number of users in the 'users' collection.
   * @returns {Promise<number>} The number of users.
   */
  async nbUsers() {
    return this.dbClient.db().collection('users').countDocuments();
  }

  /**
   * Retrieves the total number of files in the 'files' collection.
   * @returns {Promise<number>} The number of files.
   */
  async nbFiles() {
    return this.dbClient.db().collection('files').countDocuments();
  }

  /**
   * Retrieves a reference to the 'users' collection.
   * @returns {Promise<Collection>} The 'users' collection.
   */
  async usersCollection() {
    return this.dbClient.db().collection('users');
  }

  /**
   * Retrieves a reference to the 'files' collection.
   * @returns {Promise<Collection>} The 'files' collection.
   */
  async filesCollection() {
    return this.dbClient.db().collection('files');
  }
}

// Export an instance of DBClient
export const dbClient = new DBClient();
export default dbClient;
