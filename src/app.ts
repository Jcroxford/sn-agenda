require('dotenv').config()

import express from 'express'

const app = express()

app.get('/ping', (_, res) => {
  res.send('pong')
})

app.listen(process.env.PORT, () => console.log(`server is running on http://localhost:${process.env.PORT}`))
