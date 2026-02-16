import { Router } from 'express'
import { addAuthorEntry } from '../controllers/author.controller.js'

const authorRouter = Router()

authorRouter.post('/', addAuthorEntry)

export default authorRouter
