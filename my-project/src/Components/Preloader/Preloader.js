import React, { useEffect } from "react";
import "./Preloader.css";

export default function Preloader() {
  useEffect(() => {
    const preloader = document.getElementById("preloader");

    const handleLoad = () => {
      setTimeout(() => {
        preloader.classList.add("fade-out");

        setTimeout(() => {
          preloader.style.display = "none";
        }, 10000); // Match the transition duration in CSS
      }, 2000); // Delay before starting the fade-out animation
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div id="preloader">
      <i className="circle-preloader"></i>
      <img src="/img/salad.png" alt="Loading" />
    </div>
  );
}
