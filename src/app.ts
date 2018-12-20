require('dotenv').config()

import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import fs from 'fs'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

if (process.env.NODE_ENV === 'development') app.use(logger('dev'))

app.post('/sn-agenda', (req, res) => {
  fs.writeFileSync('res.json', JSON.stringify(req.body, null, 2))
  res.send('its working!')
})

app.listen(process.env.PORT, () => console.log(`server is running on http://localhost:${process.env.PORT}`))