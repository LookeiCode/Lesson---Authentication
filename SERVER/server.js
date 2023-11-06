express = require('express');
cors = require('cors');
app = express();
PORT = 8080;

// CORS EXPLANATION TIMESTAMP - 40:10
app.use(cors());
app.use(express.json());

// Placeholder
app.get('/', (req, res) => {
    res.send('hello world');
});

// Actual routes (from our (vite) client/app.jsx)
app.post('/auth/login', async (req, res, next) => {
    //destructuring
    const {username, password } = req.body;

    try {

    } catch (e) {

    };
});

app.post('/auth/register', async (req, res, next) => {
    //destructuring
    const {username, password } = req.body;

    try {

    } catch (e) {

    };
});


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});


// For our POST routes we put a req.body that takes the body (the object) from our axios call in our client/app.jsx
// After some testing, it seems what connects our axios call to our server is the endpoint (app.POST) and the route - if you change either the endpoint or route it won't understand the connection to our axios call in our client.app.jsx and can't retrieve the body

// RANDOM NOTES
// If "req.body" ever returns as undefined, that just means you need to install body-parser into your app
// Alternatively, if you don't want to install body-parser, you can just write "app.use(express.json();" - it does the same thing