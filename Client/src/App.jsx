import { useState } from 'react'
import './App.css'

import { Route, Routes } from 'react-router-dom'

// We will be combining the login and register forms into one which will be defined by our routes
// If we are on "/login" it'll be the login form, and if we're on "/register" we will be on the register form (but again, it's all being done by the same component - we could always make a separate component, but we're a badass fullstack dev)

// CODE BREAK DOWN *****
// We have two useStates for our username/password
// We will store the values from our input fields into them
// Inside the input, we need to set the value to the state name to connect them
// Then we have the "onChange" which is an eventlistener (ev) that sets the username to whatever is in the text field
// This is because we say that the value in the text field is = to username - and in the onchange we say target the value, and set that value as the username (setUsername(ev.target.value)) 

// We put it inside a <form> because we want to end up submitting this form and sending a request to our backend

// So we have two fields (inputs) inside a form, and when you click the submit button, the "onSubmit" will be called
// We put a "event.preventDefault();" in the onSubmit because the default behavior for form submissions is refreshing (for some dumb reason) and this method prevents the default behavior hence "preventDefault" lol

const AuthForm = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <form onSubmit={onSubmit}>
      <input placeholder="Username" value = { username } onChange = {ev => setUsername(ev.target.value)} />
      <input placeholder="Password" value = { password } onChange = {ev => setPassword(ev.target.value)} />
      <button>Submit</button>
    </form>
  );
};

// APP CODE/ROUTES BREAKDOWN ******
// We have the App that's invoked which auto initializes all the code inside of it once the page is ran
// Inside we are returning some routes
// Inside one of the routes we have the URL path of "/login" which will display whats in the element on that page
// Inside the element we have the "Login" component
// So the "/login" page will display/return whatever is being returned from the Login component

function App() {

  return (
    <>
     <Routes>
      <Route path="/login" element={<AuthForm />} />
      <Route path="/register" element={<AuthForm />} />
     </Routes>
    </>
  );
}

export default App
