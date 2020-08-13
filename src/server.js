const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash');

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// configure mongoose
const uri = process.env.ATLAS_URI
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

const connection = mongoose.connection
connection.once('open', () => {
    console.log('MongoDB database connection established successfully!')
})

// routes
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'passport', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use(flash());

// passport
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', userRouter)
app.use('/api/auth', authRouter)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})