import bodyParser from 'body-parser'
import cors from 'cors'
import express, { type Express, type Request } from 'express'

import { routes } from '@/routes'
import { errorHandler } from '@/utils/middlewares/errorHandler'

const app: Express = express()

app.use(bodyParser.json())
app.use(cors())

app.use((req: Request, _res, next) => {
  req.auth = {} as Auth

  next()
})

app.use('/auth', routes.authRoutes)

app.use(errorHandler)

export { app }
