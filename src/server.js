const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// configure mongoose
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: connection,
        ttl: 10
    })
}));

// passport initialization
app.use(passport.initialize());
app.use(passport.session());

// routes
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
app.use('/api', userRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});