import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "db_booking";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDB() {
  const client = await clientPromise;
  return client.db(dbName);
}

export { clientPromise };