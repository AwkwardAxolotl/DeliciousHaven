import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Components/GoogleAuth/GoogleAuth";
import GoogleButton from "../../Components/GoogleButton/GoogleButton";
import Preloader from "../../Components/Preloader/Preloader";
import "./SignUpIn.css";

function encodeUsername(username) {
  return btoa(username);
}

function SignUpForm() {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(null); // State to hold the message
  const [messageType, setMessageType] = React.useState(""); // State to hold the message type (success or error)

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await fetch("https://delhavback.onrender.com/SignUp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success === false) {
      setMessage(data.error || "Sign up failed. Please try again.");
      setMessageType("error");
      setState({
        username: "",
        email: "",
        password: "",
      });
      return;
    }
    setMessage("User created successfully!");
    setMessageType("success");
    setState({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleDismiss = () => {
    setMessage(null);
    setMessageType("");
  };

  return (
    <div className="form-container sign-up-container">
      <form className="cred_form" onSubmit={handleOnSubmit}>
        <h1 className="formh1">Create Account</h1>
        <div className="social-container">
          <GoogleButton
            auth={auth}
            setMessage={setMessage}
            setMessageType={setMessageType}
            navigate={navigate}
          />
        </div>
        <span className="formspan">or use your email for registration</span>
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={handleChange}
          placeholder="Username"
          className="form_input"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
          className="form_input"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
          className="form_input"
        />
        <button className="form_button" disabled={loading ? true : false}>
          {loading ? "Loading....." : "Sign Up"}
        </button>
        {message && (
          <div className={`alert ${messageType}`}>
            <h3>{message}</h3>
            <button onClick={handleDismiss} className="close-button">
              &times;
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function SignInForm() {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(null); // State to hold the message
  const [messageType, setMessageType] = React.useState(""); // State to hold the message type (success or error)

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    setMessage(null); // Clear the message before new submission
    const res = await fetch("https://delhavback.onrender.com/SignIn/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success === false) {
      setMessage(data.error || "Sign In failed. Please try again.");
      setMessageType("error");
      setState({
        username: "",
        password: "",
      });
      return;
    }
    const username = state.username; // Get the username from the state
    const encodedUsername = encodeUsername(username); // Encode the username
    setState({
      username: "",
      password: "",
    });
    navigate(`/home/${encodedUsername}`);
  };

  const handleDismiss = () => {
    setMessage(null);
    setMessageType("");
  };

  return (
    <div className="form-container sign-in-container">
      <form className="cred_form" onSubmit={handleOnSubmit}>
        <h1 className="formh1">Sign In</h1>
        <div className="social-container">
          <GoogleButton
            auth={auth}
            setMessage={setMessage}
            setMessageType={setMessageType}
            navigate={navigate}
          />
        </div>
        <span className="formspan">or use your account</span>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={state.username}
          onChange={handleChange}
          className="form_input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
          className="form_input"
        />
        <a className="form_anchor" href="/forgotPassword">
          Forgot your password?
        </a>
        <button className="form_button" disabled={loading ? true : false}>
          {loading ? "Loading....." : "Sign In"}
        </button>
        {message && (
          <div className={`alert ${messageType}`}>
            <h3>{message}</h3>
            <button onClick={handleDismiss} className="close-button">
              &times;
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default function SignUpIn() {
  const [type, setType] = useState("signIn");
  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <>
      <Preloader></Preloader>
      <div
        className="bg-container"
        style={{ backgroundImage: "url(/img/bg.jpg)" }}
      ></div>
      <div className="body shadow-lg">
        <div className="App">
          <div className={containerClass}>
            <SignUpForm />
            <SignInForm />
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1 className="formh1">Welcome Back!</h1>
                  <p className="formp">
                    To keep connected with us please login with your personal
                    info
                  </p>
                  <button
                    className="ghost form_button"
                    id="signIn"
                    onClick={() => handleOnClick("signIn")}
                  >
                    Sign In
                  </button>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1 className="formh1">Hello, Friend!</h1>
                  <p className="formp">
                    Enter your personal details and start journey with us
                  </p>
                  <button
                    className="ghost form_button"
                    id="signUp"
                    onClick={() => handleOnClick("signUp")}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
