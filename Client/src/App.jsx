import { useState } from 'react'
import axios from 'axios'

import './App.css'

import { Route, Routes, useLocation } from 'react-router-dom'

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

const login = async (username, password) => {
  try {
    await axios.post('http://localhost:8080/auth/login', 
    {
      username,
      password
    });
  } catch (e) {
    console.log('There was an error logging in');
  };

  // console.log('Login button clicked');
  // console.log(`Username: ${username}`)
  // console.log(`Password: ${password}`)
};
const register = async (username, password) => {
  try {
    await axios.post('http://localhost:8080/auth/register', 
    {
      username,
      password
    });
  } catch (e) {
    console.log('There was an error registering');
  };

  // console.log('Register button clicked');
  // console.log(`Username: ${username}`)
  // console.log(`Password: ${password}`)
};

  return (
    <>
     <Routes>
      <Route path="/login" element={<AuthForm onAuthSubmit={ login } />} />
      <Route path="/register" element={<AuthForm onAuthSubmit={ register } />} />
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
