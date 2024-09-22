import React from "react";
import "./FootComp.css";

export default function FootComp() {
  return (
    <div className="foot-body shadow-lg">
      <div className="follow-us-instagram">
        <div>
          <div className="row">
            <div className="col-12 px-5">
              <h5>Follow us on Instagram</h5>
            </div>
          </div>
        </div>

        <div className="insta-feeds d-flex flex-wrap">
          {[...Array(7)].map((_, index) => (
            <div className="single-insta-feeds" key={index}>
              <img
                src={`/img/insta${index + 1}.jpg`}
                alt={`insta${index + 1}`}
              />
              <div className="insta-icon">
                <a href="/">
                  <i className="fa-brands fa-instagram" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer-area">
        <div className="h-100">
          <div className="row h-100">
            <div className="col-12 h-100 d-flex flex-wrap align-items-center justify-content-between">
              <div className="footer-social-info text-right px-5">
                {[
                  "pinterest",
                  "facebook",
                  "twitter",
                  "dribbble",
                  "behance",
                  "linkedin",
                ].map((icon) => (
                  <a href="/" key={icon}>
                    <i
                      className={`fa-brands fa-${icon}`}
                      aria-hidden="true"
                    ></i>
                  </a>
                ))}
              </div>

              <div className="footer-logo">
                <a href="/">
                  <img src="/img/logo.png" alt="Logo" />
                </a>
              </div>

              <p>
                Copyright &copy;{new Date().getFullYear()} All rights reserved |
                This is made with{" "}
                <i className="fa-solid fa-heart" aria-hidden="true"></i> by an
                Idiot
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
