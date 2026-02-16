import { getDatabase } from '../config/database.js'

export async function initCollection(req, res) {
    try {
        const db = getDatabase()
        await db.createCollection('books', {
            validator: {
                $jsonSchema: { // keeping validation rules identical as requested functionality
                    bsonType: 'object',
                    required: ['title'],
                    properties: {
                        title: {
                            bsonType: 'string',
                            description: 'must be a string and is required',
                        },
                    },
                },
            },
        })
        return res.status(201).json({ message: 'Books collection successfully initialized.' })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function addTitleIndex(req, res) {
    try {
        const db = getDatabase()
        const operationResult = await db.collection('books').createIndex({ title: 1 })
        return res.status(201).json({ message: 'Index applied to title.', result: operationResult })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function addSingleEntry(req, res) {
    try {
        const db = getDatabase()
        const entryData = req.body
        const operationResult = await db.collection('books').insertOne(entryData)
        return res.status(201).json({ message: 'New book record added.', result: operationResult })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function addBatchEntries(req, res) {
    try {
        const db = getDatabase()
        const entries = req.body
        if (!Array.isArray(entries)) {
            return res.status(400).json({ error: 'Input must be an array of books.' })
        }
        const operationResult = await db.collection('books').insertMany(entries)
        return res.status(201).json({ message: 'Batch insert completed.', result: operationResult })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function modifyYearOfPublication(req, res) {
    const targetTitle = req.params.title
    try {
        const db = getDatabase()
        const updateQuery = { title: targetTitle }
        const updateAction = { $set: { year: 2022 } }

        const operationResult = await db.collection('books').updateOne(updateQuery, updateAction)

        return res.status(200).json({ message: 'Publication year updated.', result: operationResult })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function fetchByTitle(req, res) {
    const searchTitle = req.query.title
    try {
        const db = getDatabase()
        const foundRecord = await db.collection('books').findOne({ title: searchTitle })
        return res.status(200).json({ book: foundRecord })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function filterByYearRange(req, res) {
    const { from, to } = req.query
    try {
        const db = getDatabase()
        const minYear = parseInt(from, 10)
        const maxYear = parseInt(to, 10)

        const query = {
            year: { $gte: minYear, $lte: maxYear }
        }

        const results = await db.collection('books').find(query).toArray()
        return res.status(200).json({ books: results })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function filterByGenre(req, res) {
    const targetGenre = req.query.genre
    try {
        const db = getDatabase()
        const query = { genres: targetGenre }
        const results = await db.collection('books').find(query).toArray()
        return res.status(200).json({ books: results })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function getPaginatedList(req, res) {
    try {
        const db = getDatabase()
        /* Skip 2, Limit 3, Sort year desc */
        const results = await db.collection('books')
            .find({})
            .sort({ year: -1 })
            .skip(2)
            .limit(3)
            .toArray()

        return res.status(200).json({ books: results })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function filterIntegerYears(req, res) {
    try {
        const db = getDatabase()
        const query = { year: { $type: 'int' } }
        const results = await db.collection('books').find(query).toArray()
        return res.status(200).json({ books: results })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function excludeSpecificGenres(req, res) {
    try {
        const db = getDatabase()
        const excludedList = ['Horror', 'Science Fiction']
        const query = { genres: { $nin: excludedList } }
        const results = await db.collection('books').find(query).toArray()
        return res.status(200).json({ books: results })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}


export async function pruneOldBooks(req, res) {
    const yearThreshold = parseInt(req.query.year, 10)
    try {
        const db = getDatabase()
        const query = { year: { $lt: yearThreshold } }
        const operationResult = await db.collection('books').deleteMany(query)
        return res.status(200).json({ message: 'Obsolescent books removed.', result: operationResult })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

/* Aggregation Routes */

export async function getRecentStats(req, res) {
    try {
        const db = getDatabase()
        const pipeline = [
            { $match: { year: { $gt: 2000 } } },
            { $sort: { year: -1 } }
        ]
        const results = await db.collection('books').aggregate(pipeline).toArray()
        return res.status(200).json({ books: results })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function getProjectedStats(req, res) {
    try {
        const db = getDatabase()
        const pipeline = [
            { $match: { year: { $gt: 2000 } } },
            { $project: { title: 1, author: 1, year: 1, _id: 0 } }
        ]
        const results = await db.collection('books').aggregate(pipeline).toArray()
        return res.status(200).json({ books: results })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function getUnwoundGenres(req, res) {
    try {
        const db = getDatabase()
        const pipeline = [{ $unwind: '$genres' }]
        const results = await db.collection('books').aggregate(pipeline).toArray()
        return res.status(200).json({ books: results })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function getBookLogs(req, res) {
    try {
        const db = getDatabase()
        const pipeline = [
            {
                $lookup: {
                    from: 'logs',
                    localField: '_id',
                    foreignField: 'bookId',
                    as: 'bookLogs'
                }
            }
        ]
        const results = await db.collection('books').aggregate(pipeline).toArray()
        return res.status(200).json({ books: results })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}
