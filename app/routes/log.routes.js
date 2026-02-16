import { Router } from 'express'
import * as LogController from '../controllers/log.controller.js'

const logRouter = Router()

logRouter.post('/capped', LogController.initCappedStore)
logRouter.post('/', LogController.appendLog)

export default logRouter
