require('dotenv').config()

import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import fs from 'fs'

import knex from './db/knex'

import * as slackApi from './snagenda.bot'

import { SlackResponse } from './types/slackResponse.types'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

if (process.env.NODE_ENV === 'development') app.use(logger('dev'))

app.post('/', (req, res) => {
  const { body }: { body: SlackResponse } = req

  slackApi.handleAgendaBot(body)

  res.sendStatus(200)
})

app.post('/sn-agenda', (req, res) => {
  fs.writeFileSync('res.json', JSON.stringify(req.body, null, 2))
  res.send('its working!')
})

knex.raw('select 1+1 as result')
  .then(() => {
    console.log('connection to database established')

    app.listen(process.env.PORT, () => console.log(`server is running on http://localhost:${process.env.PORT}`))
  })
  .catch(() => console.log('unable to establish connection to the database'))
