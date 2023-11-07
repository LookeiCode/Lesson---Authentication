const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

//Gives you access to the DB
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt');

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
        next(e);
    };
});

// REGISTER FLOW
// 1. Check if user already exists - if user IS null, that means the user doesn't exist yet and can be created

// const user = await prisma.users.findUnique({
//     where: {
//         username
//     },
// });

// 2. If yes, give an error - if user is NOT null, that means the user already exists

// if (user) {
//     return res.status(409).send({message: "User already exists"});
// }

// 3. If no, create a new user in the DB and return the token that is tied to the user

// const newUser = await prisma.newUser.create({
//     data: {
//         username,
//         password,
//     },
// });


app.post('/auth/register', async (req, res, next) => {
    console.log(req.body);
    //destructuring
    const {username, password } = req.body;
    console.log(prisma.users);
    // 1
    try {
        const user = await prisma.users.findUnique({
            where: {
                username,
            },
        });

        // console.log(user);  
        // ^ Shows if user is null or not after clicking register button (demo purposes)

    // 2
        if (user) {
            return res.status(409).send({message: "User already exists"});
        }

    // 3

        // bcrypt takes 2 args
        // 1. the PW that you want to hash
        // 2. the number of salt rounds - if we have 10, it hashes the password 10 times
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Comment out "newUser" if you want to demo this and see what the hashedPassword looks like
        // console.log(hashedPassword);

        const newUser = await prisma.users.create({
            data: {
                username,
                password: hashedPassword
            },
        });

        console.log(newUser);
    } catch (e) {
        next(e);
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