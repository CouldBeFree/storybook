const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Load users model
require('./models/User');

// Passport config
require('./config/passport')(passport);

// Routes
const auth = require('./routes/auth');

mongoose.Promise = global.Promise;

// Mongo connection
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use('/auth', auth);

app.get('/', (req, res) => {
    res.send('It works')
});

const port = 4000;

app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
});
