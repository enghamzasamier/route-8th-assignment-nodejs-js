import { getDatabase } from '../config/database.js'

export async function initCappedStore(req, res) {
    try {
        const db = getDatabase()
        /* Capped collection size in bytes: 1MB = 1048576 bytes */
        const options = {
            capped: true,
            size: 1048576,
            max: 1000,
        }

        await db.createCollection('logs', options)

        return res.status(201).json({ message: 'Log storage initialized (capped).' })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function appendLog(req, res) {
    try {
        const db = getDatabase()
        const logData = req.body
        const result = await db.collection('logs').insertOne(logData)

        return res.status(201).json({ message: 'Log entry recorded.', result })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}
