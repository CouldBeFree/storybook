const express = require('express');
const exphbs = require('express-handlebars');
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
const index = require('./routes/index');

mongoose.Promise = global.Promise;

// Mongo connection
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Use routes
app.use('/', index);
app.use('/auth', auth);

const port = 4000;

app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
});
