const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// connect to MongoDB
mongoose.connect('mongodb://localhost/textForAuth')
const db = mongoose.connection

// handle mongo Error
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('Connected to db!'))

// use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}))

// parse incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// serve statis files from /public
app.use(express.static(__dirname + '/public'))

// include routes
const routes = require('./routes/router')
app.use('/', routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found')
  err.status = 404
  next(err)
})

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message)
})

// listen on port 3000
app.listen(3000, () => console.log('Listening on port 3000!'))
