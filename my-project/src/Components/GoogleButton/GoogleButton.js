import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function encodeUsername(username) {
  return btoa(username);
}

const GoogleButton = ({ auth, setMessage, setMessageType, navigate }) => {
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch("https://del-hav-back-gkh2xx6ly-krashnas-projects.vercel.app/GoogleSignUpIn/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.displayName,
          email: user.email,
          password: user.uid,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const username = data.username;
        const encodedUsername = encodeUsername(username);
        navigate(`/home/${encodedUsername}`);
      } else {
        setMessage(data.error || "Process failed. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.message || "Process failed. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <a onClick={handleGoogleAuth} className="social form_anchor">
      <i className="fab fa-google-plus-g" />
    </a>
  );
};

export default GoogleButton;
