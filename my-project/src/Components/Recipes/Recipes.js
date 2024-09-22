import React, { useEffect, useState } from "react";
import "./Recipes.css"; // Ensure this file contains styles for the alert system
import { useParams } from "react-router-dom";

export default function Recipes() {
  const { username } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(""); // State to store error messages
  const recipesPerPage = 6;

  const fetchRecipes = async (category = "", ingredients = "") => {
    try {
      const res = await fetch("http://localhost:8000/getRecipes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, ingredients }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error); // Set the error message
      } else {
        setError(""); // Clear error if successful
        if (category || ingredients) {
          setRecipes(data.recipes || []);
        } else {
          setCategories(data.categories || []);
          setRecipes(data.recipes || []);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again."); // Set error if fetch fails
    }
  };

  useEffect(() => {
    fetchRecipes(); // Fetch categories on initial load
  }, []);

  // Calculate the number of pages
  const pageCount = Math.ceil(recipes.length / recipesPerPage);

  // Get the recipes to display on the current page
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  // Handle page change
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page
    fetchRecipes(selectedCategory, ingredients);
  };

  // Handle dismiss alert
  const dismissAlert = () => setError("");

  return (
    <>
      <div
        className="page-title bg-img bg-overlay mt-3"
        style={{
          backgroundImage: "url(/img/breadcumb4.jpg)",
          overflowX: "hidden",
          height: "500px",
        }}
      >
        <div className="h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12">
              <div className="breadcumb-text text-center">
                <div className="container-fluid">
                  <div className="receipe-post-search mb-80">
                    <div className="container-fluid">
                      <form onSubmit={handleSearch}>
                        <div className="row">
                          <div className="col-12 col-lg-3">
                            <select
                              name="select1"
                              id="select2"
                              onChange={(e) =>
                                setSelectedCategory(e.target.value)
                              }
                            >
                              <option disabled hidden>
                                --Select Category--
                              </option>
                              <option value="">All Categories</option>
                              {categories.map((category, index) => (
                                <option value={category} key={index}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-12 col-lg-3">
                            <input
                              type="search"
                              name="search"
                              placeholder="Enter Ingredients"
                              value={ingredients}
                              onChange={(e) => setIngredients(e.target.value)}
                            />
                          </div>
                          <div className="col-12 col-lg-3 text-right">
                            <button type="submit" className="btn delicious-btn">
                              Search
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {error && (
            <div className={`alert error`}>
            <h3>{error}</h3>
            <button onClick={dismissAlert} className="close-button">
              &times;
            </button>
          </div>
          )}
        </div>
      </div>

      <section className="recipe-section spad mt-5">
        <div className="container-fluid">
          <div className="row">
            {currentRecipes.length > 0 ? (
              currentRecipes.map((recipe, index) => (
                <div className="col-lg-4 col-sm-6 my-4" key={index}>
                  <div className="recipe-item">
                    <a href="#">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        onError={(e) => {
                          e.target.src = "/img/default_image.png";
                        }}
                      />
                    </a>
                    <div className="ri-text">
                      <div className="cat-name text-center fs-4">
                        {recipe.category}
                      </div>
                      <a href={"/recipeSingle/"+username+"/"+recipe.title}>
                        <h5 className="text-black">{recipe.title}</h5>
                      </a>
                      <div className="details">
                        <p>
                          <strong>Prep Time:</strong>{" "}
                          {recipe.details["Total Time:"]}{" "}
                        </p>
                        <p>
                          <strong>Servings:</strong>{" "}
                          {recipe.details["Servings:"]}
                        </p>
                        <p>
                          <strong>Rating:</strong>{" "}
                          <span className="rating-stars-recipe">
                            {typeof recipe.rating === "number"
                              ? Array.from({ length: 5 }, (_, i) => {
                                  const fullStars = Math.floor(recipe.rating);
                                  const decimalPart = recipe.rating - fullStars;

                                  if (i < fullStars) {
                                    return (
                                      <i
                                        key={i}
                                        className="fas fa-star"
                                        style={{ color: "gold" }}
                                      ></i>
                                    ); // Full star
                                  } else if (
                                    i === fullStars &&
                                    decimalPart >= 0.75
                                  ) {
                                    return (
                                      <i
                                        key={i}
                                        className="fas fa-star"
                                        style={{ color: "gold" }}
                                      ></i>
                                    ); // Almost full star for ratings like 4.8
                                  } else if (
                                    i === fullStars &&
                                    decimalPart >= 0.25
                                  ) {
                                    return (
                                      <i
                                        key={i}
                                        className="fas fa-star-half-alt"
                                        style={{ color: "gold" }}
                                      ></i>
                                    ); // Half star for ratings like 4.5
                                  } else {
                                    return (
                                      <i
                                        key={i}
                                        className="far fa-star"
                                        style={{ color: "gold" }}
                                      ></i>
                                    ); // Empty star
                                  }
                                })
                              : Array.from({ length: 5 }, (_, i) => (
                                  <i
                                    key={i}
                                    className="far fa-star"
                                    style={{ color: "gold" }}
                                  ></i> // Display 0 stars if no rating is given
                                ))}
                          </span>
                          {typeof recipe.rating !== "number" && (
                            <span
                              style={{ marginLeft: "10px", color: "#6c757d" }}
                            ></span>
                          )}
                          {" (" + recipe["total_reviews"] + ")"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="col-12 text-center"
                style={{
                  color: "#6c757d",
                  fontSize: "1.5rem",
                  padding: "50px 0",
                }}
              >
                No recipes found. Please try a different search.
              </div>
            )}
          </div>

          {recipes.length > 0 && pageCount > 1 && (
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  ></button>
                </li>
                {Array.from({ length: Math.min(pageCount, 5) }, (_, index) => {
                  // Determine the starting page number
                  const startPage = Math.max(
                    1,
                    Math.min(currentPage - 2, pageCount - 4)
                  );
                  return startPage + index;
                }).map((pageNumber) => (
                  <li
                    key={pageNumber}
                    className={`page-item ${
                      currentPage === pageNumber ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === pageCount ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  ></button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
