import bodyParser from 'body-parser'
import cors from 'cors'
import express, { type Express } from 'express'

const app: Express = express()

app.use(bodyParser.json())
app.use(cors())

export { app }
