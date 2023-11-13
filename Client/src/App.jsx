import { useState, useEffect } from 'react'
import axios from 'axios'

import './App.css'

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

// We will be combining the login and register forms into one which will be defined by our routes
// If we are on "/login" it'll be the login form, and if we're on "/register" we will be on the register form (but again, it's all being done by the same component - we could always make a separate component, but we're a badass fullstack dev)

// CODE BREAK DOWN *****
// We have two useStates for our username/password
// We will store the values from our input fields into them
// Inside the input, we need to set the value to the state name which connects them
// Then we have the "onChange" which is an eventlistener (ev) that sets the username to whatever is in the text field
// This is because we say that the value in the text field is = to username - and in the onchange we say target the value, and set that value as the username (setUsername(ev.target.value)) 

// We put it inside a <form> because we want to end up submitting this form and sending a request to our backend

// So we have two fields (inputs) inside a form, and when you click the submit button, the "onSubmit" will be called
// We put a "event.preventDefault();" in the onSubmit because the default behavior for form submissions is refreshing (for some dumb reason) and this method prevents the default behavior; hence "preventDefault" lol

const AuthForm = ({ onAuthSubmit }) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const location = useLocation();

  const onSubmit = (event) => {
    event.preventDefault();

    // console.log('Username:', username);
    // console.log('Password:', password);

    onAuthSubmit(username, password);

  };

  return (
    <form onSubmit={onSubmit}>
      <input placeholder="Username" value = { username } onChange = {ev => setUsername(ev.target.value)} />
      <input placeholder="Password" value = { password } onChange = {ev => setPassword(ev.target.value)} />
      <button>{location.pathname == "/login" ? "Login" : "Register"}</button>
    </form>
  );
};

// The location hook allows us to change code based on our current location, such as our pathname in the URL (ex: /login or /register)
// So for button we used a ternary operator (if/else) that says IF the locations pathname is equal to "/login" then display "Login" on the button, but if the pathname isn't "/login", aka "/register" (or anything else for that matter) then display "Register" on the button instead



// APP CODE/ROUTES BREAKDOWN ******
// We have the App that's invoked which auto initializes all the code inside of it once the page is ran
// Inside we are returning some routes
// Inside one of the routes we have the URL path of "/login" which will display whats in the element on that page
// Inside the element we have the "Login" component
// So the "/login" page will display/return whatever is being returned from the Login component



// AXIOS EXPLAINED
// 1. The reason we use post (axios.post) is because we want to take in the username and password as the body! ( you know, like req.body)
// 2. We then pass the username and password in as the second argument (for axios) and also as an object
// 3. The object is known as the body basically


function App() {

// This will be the user that is currently logged in
// It's set/start it off as null because there is no logged in user by default
const [user, setUser] = useState(null);

const navigate = useNavigate();

// Makes page keep you logged in if you already logged in
useEffect(() => {

  const loginRefresh = async () => {
  // Checks for token in local storage
  const token = window.localStorage.getItem('token');

  if (token) {
    const userResponse = await axios.get('http://localhost:8080/auth/me',
    {
      headers: {
        authorization: token,
      },
    });
  
    const user = userResponse.data;
  
    setUser(user);
  
    navigate('/home');
  }
};
loginRefresh();
}, []);

// It has to be a post request because we're passing in the body 
const login = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:8080/auth/login', 
      {
        username,
        password,
      }
    );

    const token = response.data;
    // Shows token in client console - confirms it works
    // console.log(token);

  window.localStorage.setItem('token', token);

  // Get the user
  const userResponse = await axios.get('http://localhost:8080/auth/me',
  {
    headers: {
      authorization: token,
    },
  });

  const user = userResponse.data;

  setUser(user);

  navigate('/home');


  } catch (e) {
    console.log('There was an error logging in');
  };

  // console.log('Login button clicked');
  // console.log(`Username: ${username}`)
  // console.log(`Password: ${password}`)
};
const register = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:8080/auth/register', 
      {
        username,
        password,
      }
    );

    const token = response.data;
    // console.log(token); <--- confirms token is being sent to front end (you should see it in the console if it's connected and working/being sent from the backend properly)

      window.localStorage.setItem('token', token);
      // window is global in every frontend file
      // setItem just sets an item, obviously - the string 'token' is the key, and token (the variable) is the value
      // If you go to inspect --> then "application" --> then "Local storage" on Chrome on your app page, you will see the key/value pair (your token - which means it was successfully stored in local storage!)
  

      const userResponse = await axios.get('http://localhost:8080/auth/me',
      {
        headers: {
          authorization: token,
        },
      });
      // This is how you make an authenticated API request
      // We made a "auth/me" route in server.js
      // We made an axios call to it here
      const user = userResponse.data;

      // console.log(user);
      // Shows all the user details in the console for the frontend/client - (to confirm it works)

      // Setting the user state from the user variable above (L119) to the user state (L73)
      // This is for when you login successfully you want to set the user
      setUser(user);

      // When you successfully log in, it will move you to the homepage
      navigate('/home');

    } catch (e) {
    console.log(e);
  };

  // console.log('Register button clicked');
  // console.log(`Username: ${username}`)
  // console.log(`Password: ${password}`)
};

// We remove the token from localStorage and set the user state to null
// We set the user state to null because of the routing - if the user state has a value it shows the /home page if it doesn't it shows the /login and /register pages
const logout = () => {
window.localStorage.removeItem('token');
setUser(null);
navigate('/login');
};



// We use ternary here - if user IS logged in, they can only see the home route/page
// If they are not logged in, they can see the login/register routes/pages

// That said, the useEffect that keeps you logged in if you refresh won't let you go to any other pages like /login or /register if you try because of the routing. This is because the user state has a value. If the user state value is null THEN you have access to the other pages. Otherwise it'll keep redirecting you to the /home page.

  return (
    <>
     <Routes>
      {user ? (<Route path='/home' element={
      <>
      <h1>You are logged in as {user.username}. <br/>Your password is {" "}{user.password}</h1>
      <button onClick={ logout }>Logout</button>
      </>
      } />) : 
      (
        <>
      <Route path="/login" 
      element={<AuthForm onAuthSubmit={ login } />} />

      <Route path="/register" 
      element={<AuthForm onAuthSubmit={ register } />} />
        </>
      )}
     </Routes>
    </>
  );
}

// EXPLAINING "onAuthSubmit"
// 1. We put it inside the "AuthForm" component as a prop
// 2. Hence the name, we put it inside the "onSubmit" function -> when the button is clicked the onSubmit function is fired which also triggers "onAuthSubmit"
// 3. We also pass it into our App component routes to their respective routes
// 4. We assign a function to them called "login" for the login route, and "register" for the register route - onAuthSubmit IS both "login" and "register"
// 5. We then make the functions in the app component, which simply just console log a message when the button is clicked.
// 6. We can put "username" and "password" into them because remember, login and register IS onAuthSubmit, and on L34 we passed username and password into onAuthSubmit - so now we can use username and password in our function if we want - in this case we can put it in our console log just to demo
// 7. So whenever the button is clicked it triggers "onSubmit" which contains "onAuthSubmit" inside of it, which then triggers too, which is connected inside the routes to a function, which triggers, that then sends a console log.

export default App
