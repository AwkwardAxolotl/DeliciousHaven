import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <header>
      <div className="top_header_area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-5 col-sm-6">
              {/* Top Social bar start */}
              <div className="top_social_bar">
                <a href="#">
                  <i className="fa-brands fa-facebook" aria-hidden="true"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-twitter" aria-hidden="true"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-linkedin" aria-hidden="true"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-skype" aria-hidden="true"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-dribbble" aria-hidden="true"></i>
                </a>
              </div>
            </div>
            {/* Login Register Area */}
            <div className="col-7 col-sm-6">
              <div className="signup-search-area d-flex align-items-center justify-content-end">
                <div
                  className={`login_register_area ${
                    showSearch ? "hidden" : ""
                  }`}
                >
                  <div className="login">
                    <a href="/" style={{fontWeight:"bold",color:"red"}}>Logout</a>
                  </div>
                </div>
                {/* Search Button Area */}
                {/* <div className="search_button">
                  <a className="searchBtn" href="#">
                    <i className="fa fa-search" aria-hidden="true" onClick={toggleSearch}></i>
                  </a>
                </div>
                <div
                  className={showSearch ? "search-form-open" : "search-hidden-form"}
                >
                  <form action="#" method="get">
                    <input
                      type="search"
                      name="search"
                      id="search-anything"
                      placeholder="Search Anything..."
                    />
                    <input type="submit" value="" className="d-none" />
                    <span className="searchBtn">
                      <i
                        className="fa fa-times"
                        aria-hidden="true"
                        onClick={toggleSearch}
                      ></i>
                    </span>
                  </form>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Top Header Area End */}

      {/* Header Area Start */}
      <header className="header_area shadow-lg">
        <div className="container-fluid">
          <div className="row">
            {/* Logo Area Start */}
            <div className="col-12">
              <div className="logo_area text-center">
                <a href={"/home/" + username}>
                  <img
                    src="/img/logo.png"
                    alt="Logo"
                    width="200"
                    className="my-3"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <nav className="navbar navbar-expand-lg">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#yummyfood-nav"
                  aria-controls="yummyfood-nav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <i className="fa fa-bars" aria-hidden="true"></i> Menu
                </button>
                {/* Menu Area Start */}
                <div
                  className="collapse navbar-collapse justify-content-center"
                  id="yummyfood-nav"
                >
                  <ul className="navbar-nav" id="yummy-nav">
                    <li className="nav-item">
                      <a className="nav-link" href={"/home/" + username}>
                        Home
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href={"/recipes/" + username}>
                        Recipes
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href={"/blog/" + username}>
                        Blogs
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href={"/profile/" + username}>
                        Profile
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href={"/about/" + username}>
                        About
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href={"/contact/" + username}>
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </header>
  );
}
