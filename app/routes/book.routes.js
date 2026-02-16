import { Router } from 'express'
import * as BookController from '../controllers/book.controller.js'

const router = Router()

/* 
 * Dispatcher for POST root to handle Collection Creation vs Record Insertion
 * based on the mounting path.
 */
router.post('/', (req, res, next) => {
    const isCollectionRoute = req.baseUrl.includes('collection')

    if (isCollectionRoute) {
        return BookController.initCollection(req, res)
    }

    return BookController.addSingleEntry(req, res)
})

router.post('/index', BookController.addTitleIndex)
router.post('/batch', BookController.addBatchEntries)

router.patch('/:title', BookController.modifyYearOfPublication)

router.get('/title', BookController.fetchByTitle)
router.get('/year', BookController.filterByYearRange)
router.get('/year-integer', BookController.filterIntegerYears)
router.get('/genre', BookController.filterByGenre)
router.get('/skip-limit', BookController.getPaginatedList)
router.get('/exclude-genres', BookController.excludeSpecificGenres)
router.get('/aggregate1', BookController.getRecentStats)
router.get('/aggregate2', BookController.getProjectedStats)
router.get('/aggregate3', BookController.getUnwoundGenres)
router.get('/aggregate4', BookController.getBookLogs)

router.delete('/before-year', BookController.pruneOldBooks)

export default router
