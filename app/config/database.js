import { MongoClient } from 'mongodb'

const URL = 'mongodb://localhost:27017'
const DB_NAME = 'LibrarySystem_Refactored'

const client = new MongoClient(URL)

let databaseInstance = null

export const initializeDatabase = async () => {
  try {
    await client.connect()
    console.log('Successfully connected to MongoDB.')
    databaseInstance = client.db(DB_NAME)
  } catch (error) {
    console.error('Failed to establish database connection:', error)
    process.exit(1)
  }
}

export const getDatabase = () => {
  if (!databaseInstance) {
    throw new Error('Database not initialized. Call initializeDatabase first.')
  }
  return databaseInstance
}
