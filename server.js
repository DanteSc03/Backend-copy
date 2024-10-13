require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger, logEvents } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const sequelize = require('./config/dbConn');
const PORT = process.env.PORT || 3500; //8080 for azure
const User = require('./model/UserSQL');



// Custom middleware logger
app.use(logger);

// Handle options credentials check for CORS
app.use(credentials);

// CORS middleware (with credentials option)
app.use(cors(corsOptions));

// Middleware for handling URL-encoded data and JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware for handling cookies
app.use(cookieParser());

//Health check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});


// Serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes (Public)
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// JWT verification (Protected routes)
app.use(verifyJWT);

// Routes (Protected)
app.use('/users', require('./routes/api/users'));


// 404 handling
app.all('/*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
});

// Error handler (must be the last middleware)
app.use(errorHandler);

// Start server after DB connection
(async () => {
    try {
        await sequelize.authenticate();  
        console.log('Connection to the database has been established successfully.');

        await sequelize.sync();
        console.log('Database synced.');

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        logEvents(`${err.name}: ${err.message}`, 'dbErrorLog.log');
    }
})();
