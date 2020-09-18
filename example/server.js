const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('../')(session)

mongoose.connect('mongodb://localhost:27017/session', { useNewUrlParser: true })

mongoose.Promise = global.Promise
const db = mongoose.connection
console.log(db)
const store = new MongoStore({ mongooseConnection: db })
store.once('connected', function() {
  console.log('connected')
})

const app = express()
const port = 3000

app.use(cookieParser())
app.use(
  session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
    store: store,
  })
)

const varSession = 'aa'
app.get('/', function(req, res, next) {
  if (req.session[varSession]) {
    req.session[varSession]++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>varSession: ' + req.session[varSession] + '</p>')
    res.write('<p>expires in: ' + req.session.cookie.maxAge / 1000 + 's</p>')
    res.end()
  } else {
    req.session[varSession] = 1
    res.end('welcome to the session demo. refresh!')
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
