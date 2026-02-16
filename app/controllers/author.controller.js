import { getDatabase } from '../config/database.js'

export async function addAuthorEntry(req, res) {
    try {
        const db = getDatabase()
        const authorData = req.body
        const insertResult = await db.collection('authors').insertOne(authorData)

        return res.status(201).json({
            message: 'New author recorded successfully.',
            result: insertResult
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}
