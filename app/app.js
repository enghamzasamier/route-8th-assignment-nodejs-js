import express from 'express'
import { initializeDatabase } from './config/database.js'
import bookRoutes from './routes/book.routes.js'
import authorRoutes from './routes/author.routes.js'
import logRoutes from './routes/log.routes.js'

const SERVER_PORT = process.env.PORT || 3000
const application = express()

application.use(express.json())

/* Establish Database Connection */
initializeDatabase()

/* Route Mounting */
/* Map to '/collection/...' for collection management */
application.use('/collection/books', bookRoutes)
application.use('/collection/authors', authorRoutes)
application.use('/collection/logs', logRoutes)

/* Map to '/...' for standard operations */
application.use('/books', bookRoutes)
application.use('/logs', logRoutes)

application.listen(SERVER_PORT, () => {
    console.log(`Application server is active on port ${SERVER_PORT}`)
})
