import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { username } = useParams();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

  const fetchAllRecipes = async () => {
    try {
      const res = await fetch("http://localhost:8000/getAllRecipes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(username),
      });
      const data = await res.json();

      if (data.success) {
        setRecipes(data.recipes);
      } else {
        console.log(data.error);
        setRecipes([]);
      }
    } catch (error) {
      setRecipes([]);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(term)
    );
    setFilteredRecipes(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
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
                      <a href="/" style={{ fontWeight: "bold", color: "red" }}>
                        Logout
                      </a>
                    </div>
                  </div>
                  <div
                    className="search-icon"
                    onClick={() => setShowSearch(!showSearch)}
                  >
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Search Bar */}
        <div className={`search-bar ${showSearch ? "search-form-open" : ""}`}>
          <input
            type="text"
            id="search-anything"
            placeholder="Search for recipes..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <span onClick={() => setShowSearch(false)}>×</span>
        </div>

        {/* Navbar content */}
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
                      <li className="nav-item">
                        <a className="nav-link" href={"/addRecipe/" + username}>
                          Add Recipe
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
      <div className={`search-bar ${showSearch ? "search-form-open" : ""}`}>
        <input
          type="text"
          id="search-anything"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <span onClick={() => setShowSearch(false)}>×</span>
      </div>

      {/* Conditionally render filtered recipe cards with pagination */}
      {showSearch && searchTerm !== "" && filteredRecipes.length > 0 && (
        <div className="recipes-section mt-4">
          <div className="row">
            {currentRecipes.map((recipe) => (
              <div className="col-12 col-md-4" key={recipe.id}>
                <div className="card mb-4 shadow-sm">
                  <img
                    className="card-img-top"
                    src={recipe.image}
                    alt={recipe.title}
                    onError={(e) => {
                      e.target.src = "/img/default_image.png";
                    }}
                  />
                  <div className="card-body">
                    <a href={"/recipeSingle/" + username + "/" + recipe.title}>
                      <h5 className="card-title">{recipe.title}</h5>
                    </a>
                    <p className="card-text">Rating: {recipe.rating}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-success me-2"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="align-self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-success ms-2"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
