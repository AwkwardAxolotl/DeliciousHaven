import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Preloader from "../../Components/Preloader/Preloader";

function SendOTPForm({ onSuccess }) {
  const [state, setState] = useState({
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // State to hold the message
  const [messageType, setMessageType] = useState(""); // State to hold the message type (success or error)

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
    const res = await fetch("http://localhost:8000/forPass/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success === false) {
      setMessage(data.error || "Sending OTP failed. Please try again.");
      setMessageType("error");
      setState({
        email: "",
      });
      return;
    }
    setState({
      email: "",
    });
    onSuccess();
  };

  const handleDismiss = () => {
    setMessage(null);
    setMessageType("");
  };
  return (
    <div className="form-container sign-in-container">
      <form className="cred_form" onSubmit={handleOnSubmit}>
        <h1 className="formh1">Send OTP</h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
          className="form_input"
        />
        <button className="form_button" disabled={loading ? true : false}>
          {loading ? "Sending....." : "Send OTP"}
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

function EnterOTPForm({ onTimeOut }) {
  const navigate = useNavigate();
  const [state, setState] = useState({
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // State to hold the message
  const [messageType, setMessageType] = useState(""); // State to hold the message type (success or error)
  const [remainingTime, setRemainingTime] = useState(180); // State to hold the remaining time in seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeOut();
    }, 180000); // 3 minutes

    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onTimeOut]);

  useEffect(() => {
    if (remainingTime <= 0) {
      onTimeOut();
    }
  }, [remainingTime, onTimeOut]);

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
    const res = await fetch("http://localhost:8000/valOTP/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success === false) {
      setMessage(data.error || "Validation failed. Please try again.");
      setMessageType("error");
      setState({
        otp: "",
      });
      return;
    }
    setState({
      otp: "",
    });
    const username = data.username;
    navigate(`/home/${btoa(username)}`);
  };

  const handleDismiss = () => {
    setMessage(null);
    setMessageType("");
  };

  return (
    
    <div className="form-container sign-up-container">
      <form className="cred_form" onSubmit={handleOnSubmit}>
        <h1 className="formh1">Enter OTP</h1>
        <input
          type="text"
          name="otp"
          value={state.otp}
          onChange={handleChange}
          placeholder="OTP"
          className="form_input"
        />
        <button className="form_button" disabled={loading ? true : false}>
          {loading ? "Validating....." : "Enter OTP"}
        </button>
        <div className="timer">Time remaining: {remainingTime}s</div>
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
export default function Otp() {
  const [type, setType] = useState("signIn");

  const handleSuccess = () => {
    setType("signUp");
  };

  const handleTimeOut = () => {
    setType("signIn");
  };

  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <>
      <Preloader></Preloader>
      <div className="bg-container" style={{backgroundImage:"url(/img/bg.jpg)"}}></div>
      <div className="body">
        <div className="App">
          <div className={containerClass}>
            {type === "signIn" ? (
              <SendOTPForm onSuccess={handleSuccess} />
            ) : (
              <EnterOTPForm onTimeOut={handleTimeOut} />
            )}
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1 className="formh1">Hurry Up!!</h1>
                  <p className="formp">
                    You only have 3 minutes to enter the OTP before it
                    expires!!!!.
                  </p>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1 className="formh1">Remember!</h1>
                  <p className="formp">
                    Please enter your registered email address only!!!.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
