// Import Express framework
const express = require('express')

//import dotenv
const dotenv = require("dotenv");

dotenv.config();

//import dabase connection
const DbConnection=require('./databaseConnection')


const dns = require("dns");

dns.setServers(['8.8.8.8'])
// // Import data from JSON files
// const {users} = require('./data/users.json')
// const {books} = require('./data/books.json')

//import routes for users and books
const userRoutes = require('./routes/users')
const bookRoutes = require('./routes/books')

// Create an instance of the Express application
const app = express()

// Middleware: Parse incoming JSON requests
app.use(express.json()); 

// Define server port
const port = 8081

// Define a root route for the API
app.get('/', (req, res) => {
    res.send('Welcome to the Library Management System API');
})


// Use imported routes for handling user and book-related requests
app.use('/users',userRoutes)
app.use('/books',bookRoutes)


// Catch-all route for unmatched requests (currently disabled)
// app.all(/.*/, (req, res) => {
//     res.status(500).json({
//         message: "NOT built yet"
//     });
// });

// Start the Express server and listen on the specified port
async function startServer() {
    try {
        await DbConnection();
        app.listen(port, () => {
            console.log(`server run on port http://localhost:${port}`)
        });
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exitCode = 1;
    }
}

startServer();
