const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 8080;

//Gives you access to the DB
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// CORS EXPLANATION TIMESTAMP - 40:10
app.use(cors());
app.use(bodyParser.json());

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
    // console.log(req.body);
    //destructuring
    const {username, password } = req.body;
    // 1
    try {
        const user = await prisma.accounts.findUnique({
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

        const newUser = await prisma.accounts.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        const token = jwt.sign(newUser, process.env.JWT_SECRET_KEY)
        res.send(token);
        // console.log(newUser);
    } catch (e) {
        next(e);
    };
});

// -----------------------------------------------------------------------------------------------------------
// JWT (JSON WEB TOKEN) INFO
// 1. What JWT does - it takes a user and "transforms" the user into a token
// 1.5. (The "token" is the key to knowing everything about authentication)
// 2. The token is LITERALLY the user - the user becomes the token via JWT - JWT "tokenizes" the user
// 3. The token looks like a hashed password pretty much --> ex: user(tokenized) = sdfb26jafa%avf12f <-- Thats a token
// 4. If someone got access to your token that means they literally hacked your account. They have access to your account, entirely. 
// 5. The token is the "key" to the user to unlock the account basically - it is the key to your account in other words.
// 5.5 Yes the token is the key to the account, but is also the user - confusing, but don't get hung up on it. Just understand it simply acts as a key.

// - jwt.sign() takes two arguments
//   1. what do you want to sign? (In this case we will just sign the user)
//   2. a secret key - it can be anything, but preferably it should be pretty secure
// SIDE NOTE: The secret key is basically a signature for the user - just another way to think about it

// - What JWT does is take your user, and your secret key and transforms it into a token
// - Yuu want to put it into your .env file so nobody sees it (put .env in your gitignore when pushing to repo)
// - ex: JWT_SECRET_KEY="shhhdonttellanyone"
// SIDE NOTE: If you add/change anything in the .env you need to stop/restart the server - (also env stands for environment and the variables in it are called environment variables (duh))

// You can console.log the secret to see what it is with --> console.log(process.env.JWT_SECRET_KEY);
// You can also console.log the token after you put it into the jwt.sign() and click register --> console.log(token);
// What you see console logged from the token is literally the user - just the giant string of random characters


// STEPS FOR REGISTERING/AUTHENTICATION
// 1. Typed in un, email, pw
// 2. Make an axios call to our backend
// 3. Check if user exists
// 4. If yes, return 404 error "user exists/username taken"
// 5. If no create the user
// 6. Hash the pw
// 7. Generate a token out of the user
// 8. Send that token to the client/frontend

// LOGGING IN
// The token is EVERYTHING when it comes to auth
// You know websites like Youtube, FB, Amazon, etc where you never really have to re-login? That's the token
// That's why we sent the token to the frontend/client so it behaves the same way

// How do you automatically login without typing in the UN/PW?
// The token gets stored in the cookies (that's why when you clear them from your history you need to re-login into every website you previously were logged into)
// We're gonna use local storage now though because it's easier to use
// So we will put our token into local storage, and whenever we load up the application, we will automatically be logged in
// So whenever We refresh our app, it will check if our token is in local storage
// 1. If it is, user is already logged in
// 2. if user is not logged in, suer should see login page

// That checkbox that says "keep me logged in" just stores your token into cookies if you check it
// -----------------------------------------------------------------------------------------------------------


// This route is to use the token to get the user data
// 1. It takes in the token - you will need the authorization token
// 2. It transforms that token to the users data and sends it back to the client/frontend

app.get('/auth/me', async (req, res, next) => {

    const token = req.headers.authorization;
// Gets our auth token from the backend to send to the frontend

    // console.log(token);
// Confirms that the token/route are working - should log the token in the terminal

    // console.log(req.headers);
// Shows what headers looks like in our terminal when we click register
// Inside it you will see "authorization" containing our token - we made this on the frontend/client inside the "userResponse" axios call

// Now we want to transform this token to get the users data
const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
// jwt.verify takes in 2 args
// 1. The token
// 2. The same secret key you used before from the jwt.sign (L99)

// You're kind of doing encryption here because you're encrypting "newUser" with the help of a secret key (L99)
// In here we are decrypting it (L176) - decrypting it from the tokeN back to the user

// Hashing is one way (like bcrypt) it just keeps moving forward and can't move back
// Encrypting is two ways - when you encrypt you can decrypt it back

// console.log(user);
// If all works it should show the user that you created/registered

res.send(user);

})



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});


// For our POST routes we put a req.body that takes the body (the object) from our axios call in our client/app.jsx
// After some testing, it seems what connects our axios call to our server is the endpoint (app.POST) and the route - if you change either the endpoint or route it won't understand the connection to our axios call in our client.app.jsx and can't retrieve the body

// RANDOM NOTES
// If "req.body" ever returns as undefined, that just means you need to install body-parser into your app
// Alternatively, if you don't want to install body-parser, you can just write "app.use(express.json();" - it does the same thing


// Whenever something console logs in the terminal that means it's on your backend/server
// Whenever something console logs in the console on the browser that means it's on your frontend/client