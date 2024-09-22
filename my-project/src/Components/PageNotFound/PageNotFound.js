import React from "react";
import "./PageNotFound.css";

const PageNotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-background"></div>
      <div className="not-found-decorations">
        <div className="decorative-blob blob-one"></div>
        <div className="decorative-blob blob-two"></div>
        <div className="decorative-blob blob-three"></div>
      </div>
      {/* <h1 className="not-found-title">Page not found :(</h1> */}
      <div className="not-found-content">
        <img
          src="/img/Gordon Ramsay.png"
          alt="Where's the page meme"
          className="not-found-image"
        />
        <p className="not-found-text" style={{ fontWeight: "bolder" }}>
          Whoops! This page is lost in the sauce. Looks like even Gordon can't
          help you find it.
        </p>
        <p className="not-found-subtext" style={{ fontWeight: "bolder" }}>
          Don't worry, we've compiled a few tips:
        </p>
        <ul className="not-found-list" style={{ fontWeight: "bolder" }}>
          <li>🔍 Check the URL for any sneaky typos.</li>
          <li>🔙 Hit the back button and try again.</li>
          <li>🚀 Click the button below to teleport back to safety.</li>
        </ul>
        <a href="/" className="not-found-button">
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;
