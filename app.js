const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

// Load models
require('./models/User');
require('./models/Story');

// Passport config
require('./config/passport')(passport);

// Handlebars helpers
const {
    truncate,
    stripTags,
    formatDate
} = require('./helpers/hbs');

// Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

mongoose.Promise = global.Promise;

// Mongo connection
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate
    },
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

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = 4000;

app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
});
