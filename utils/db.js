import mongodb from 'mongodb';
// eslint-disable-next-line no-unused-vars
import Collection from 'mongodb/lib/collection';
import envLoader from './env_loader';

/**
 * A client for interacting with a MongoDB database.
 * Handles connections and provides methods to access collections.
 */
class DBClient {
  /**
   * Initializes the DBClient.
   * Loads environment variables and sets up a connection to the MongoDB server.
   */
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost'; // MongoDB server host
    const port = process.env.DB_PORT || 27017; // MongoDB server port
    const databaseName = process.env.DB_DATABASE || 'files_manager'; // Database name
    const connectionURI = `mongodb://${host}:${port}/${databaseName}`; // Full connection URI

    this.mongoClient = new mongodb.MongoClient(connectionURI, { useUnifiedTopology: true });
    this.mongoClient.connect(); // Establish connection to MongoDB
  }

  /**
   * Checks if the connection to the MongoDB server is active.
   * @returns {boolean} True if connected, otherwise false.
   */
  isAlive() {
    return this.mongoClient.isConnected();
  }

  /**
   * Counts the number of documents in the 'users' collection.
   * @returns {Promise<number>} The total number of users.
   */
  async nbUsers() {
    return this.mongoClient.db().collection('users').countDocuments();
  }

  /**
   * Counts the number of documents in the 'files' collection.
   * @returns {Promise<number>} The total number of files.
   */
  async nbFiles() {
    return this.mongoClient.db().collection('files').countDocuments();
  }

  /**
   * Retrieves the 'users' collection from the database.
   * @returns {Promise<Collection>} A reference to the 'users' collection.
   */
  async usersCollection() {
    return this.mongoClient.db().collection('users');
  }

  /**
   * Retrieves the 'files' collection from the database.
   * @returns {Promise<Collection>} A reference to the 'files' collection.
   */
  async filesCollection() {
    return this.mongoClient.db().collection('files');
  }
}

// Export an instance of DBClient
export const dbClient = new DBClient();
export default dbClient;
