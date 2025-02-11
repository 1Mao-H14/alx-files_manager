import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.url = `mongodb://${host}:${port}`;
    this.dbName = database;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
    this.connected = false;

    this.connectionPromise = this.client.connect()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => {
        console.error(`MongoDB connection error: ${err.message}`);
        this.connected = false;
        throw err;
      });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    await this.connectionPromise;
    const db = this.client.db(this.dbName);
    const usersCollection = db.collection('users');
    return usersCollection.countDocuments();
  }

  async nbFiles() {
    await this.connectionPromise;
    const db = this.client.db(this.dbName);
    const filesCollection = db.collection('files');
    return filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
