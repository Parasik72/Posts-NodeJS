const express = require("express");
const mongoose = require("mongoose");
const config = require('./config.js');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const router = require('./routes');

const app = express();

app.use(session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        uri: config.DB_URL,
        databaseName: 'myFirstDatabase',
        collection: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

mongoose.set('useCreateIndex', true);

app.use(express.json());

app.set('view engine', 'ejs');

app.use(express.static(path.join("./", "public")));
app.use('/uploads', express.static(path.join("./", config.DESTINATION)));
app.use(
    "/javascripts",
    express.static(path.join("./", "node_modules", "jquery", "dist"))
);

//routes
app.use('/posts', router.post);
app.use('/comment', router.comment);
app.use('/api/auth', router.auth);

//wrong link
app.use((req, res, next) => {
    if(req.url === '/')
        return res.redirect('/posts');
    const error = new Error('The page was not found!');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    const {userId, userLogin} = req.session;
    const currentUrl = req.url.split('/');
    return res.status(error.status || 500).render('error',{
        error,
        user:{
            id: userId,
            login: userLogin
        },
        currentUrl: currentUrl[currentUrl.length - 1]
    });
});

const start = async () => {
    await mongoose
        .connect(config.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Authentication done!");
        })
        .catch(() => {
            console.log("Authentication failed!");
            process.exit(1);
        });
    app.listen(config.PORT, () => {
        console.log("Server working!");
    });
};

start();
