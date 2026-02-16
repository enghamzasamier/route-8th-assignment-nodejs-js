import express from 'express'
import { initializeDatabase } from './config/database.js'
import bookRoutes from './routes/book.routes.js'
import authorRoutes from './routes/author.routes.js'
import logRoutes from './routes/log.routes.js'

const SERVER_PORT = process.env.PORT || 3000
const application = express()

application.use(express.json())

/* Route Mounting */
application.use('/collection/books', bookRoutes)
application.use('/collection/authors', authorRoutes)
application.use('/collection/logs', logRoutes)

application.use('/books', bookRoutes)
application.use('/logs', logRoutes)

/* Start Server ensuring DB is connected */
const startServer = async () => {
    await initializeDatabase()

    application.listen(SERVER_PORT, () => {
        console.log(`Application server is active on port ${SERVER_PORT}`)
    })
}

startServer()
