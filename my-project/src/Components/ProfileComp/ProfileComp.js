import React, { useState, useEffect } from "react";
import "./ProfileComp.css";
import ProfileImageUpload from "../ProfileImageUpload/ProfileImageUpload";
import { useNavigate, useParams } from "react-router-dom";

const ProfileComp = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  let decUsername = "";
  try {
    decUsername = atob(username);
  } catch (error) {
    navigate("/pageNotFound");
  }
  const [formData, setFormData] = useState({
    encUsername: username,
    username: decUsername,
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    image: "",
    favourites: {},
    user_recipes: [],
    notifications: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

  const [selectedUserCategory, setSelectedUserCategory] = useState("All");
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const userRecipesPerPage = 6;

  const [errorMessage, setErrorMessage] = useState("");

  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const getData = async () => {
    const res = await fetch("https://delhavback.onrender.com/getUserDetails/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: atob(username), encUsername: username }),
    });

    const data = await res.json();

    const userData = {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      oldPassword: "",
      newPassword: "",
      image: data.image,
      favourites: data.favourites,
      user_recipes: data.user_recipes,
      notifications: data.notifications,
    };
    setFormData(userData);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleImageUploadSuccess = (newProfilePicPath) => {
    setFormData({
      ...formData,
      profile_pic: newProfilePicPath,
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  // Filtered recipes based on selected category
  const filteredRecipes =
    selectedCategory === "All"
      ? Object.values(formData.favourites).flat() // Show all recipes if 'All' is selected
      : formData.favourites[selectedCategory] || []; // Show recipes in the selected category

  // Pagination logic
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  // Pagination handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle category selection for user recipes
  const handleUserCategoryClick = (category) => {
    setSelectedUserCategory(category);
    setCurrentUserPage(1); // Reset to the first page when category changes
  };

  // Filter user recipes based on the selected category
  const filteredUserRecipes =
    selectedUserCategory === "All"
      ? formData.user_recipes // Show all user recipes if 'All' is selected
      : formData.user_recipes.filter(
          (recipe) => recipe.category === selectedUserCategory
        );

  // Pagination logic for user recipes
  const indexOfLastUserRecipe = currentUserPage * userRecipesPerPage;
  const indexOfFirstUserRecipe = indexOfLastUserRecipe - userRecipesPerPage;
  const currentUserRecipes = filteredUserRecipes.slice(
    indexOfFirstUserRecipe,
    indexOfLastUserRecipe
  );

  const totalUserPages = Math.ceil(
    filteredUserRecipes.length / userRecipesPerPage
  );

  // Pagination handler for user recipes
  const paginateUser = (pageNumber) => setCurrentUserPage(pageNumber);

  const checkData = async () => {
    const { oldPassword, newPassword } = formData;
    if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
      setErrorAlert(true);
      setSuccessAlert(false);
      setErrorMessage("Please fill both the password inputs!!!");
      return;
    }

    const res = await fetch("https://delhavback.onrender.com/updateUserDetails/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      setSuccessAlert(true);
      setErrorAlert(false);
    } else {
      setSuccessAlert(false);
      setErrorAlert(true);
      setErrorMessage(data.error || "Failed to update!!!");
      console.log(data);
    }
  };

  return (
    <div className="container-xl px-4 mt-4">
      <ul className="nav nav-tabs" id="movieTabs" role="tablist">
        <li className="nav-item">
          <a
            className="nav-link active"
            id="profile-tab"
            data-bs-toggle="tab"
            href="#profile"
            role="tab"
            aria-controls="profile"
            aria-selected="true"
          >
            Profile
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            id="rentedMovies-tab"
            data-bs-toggle="tab"
            href="#rentedMovies"
            role="tab"
            aria-controls="rentedMovies"
            aria-selected="false"
          >
            Favorites
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            id="myRecipes-tab"
            data-bs-toggle="tab"
            href="#myRecipes"
            role="tab"
            aria-controls="myRecipes"
            aria-selected="false"
          >
            My Recipes
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            id="notifs-tab"
            data-bs-toggle="tab"
            href="#notifs"
            role="tab"
            aria-controls="notifs"
            aria-selected="false"
          >
            Notifications
          </a>
        </li>
      </ul>
      <hr className="mt-0 mb-4" />
      <div className="tab-content mb-3" id="movieTabsContent">
        <div className="tab-pane fade show active" id="profile">
          <div className="row">
            <div className="col-xl-4">
              <div className="card mb-4 mb-xl-0">
                <div className="card-header">Profile Picture</div>
                <div className="card-body text-center">
                  <img
                    className="img-account-profile rounded-circle mb-2"
                    src={formData.image}
                    alt="Profile"
                  />
                  <ProfileImageUpload
                    username={decUsername}
                    onUploadSuccess={handleImageUploadSuccess}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="card mb-4">
                <div className="card-header">Account Details</div>
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <label className="small mb-1" htmlFor="inputUsername">
                        Username
                      </label>
                      <input
                        className="form-control"
                        id="inputUsername"
                        type="text"
                        value={decUsername}
                        disabled
                      />
                    </div>

                    <div className="row gx-3 mb-3">
                      <div className="col-md-6">
                        <label className="small mb-1" htmlFor="inputFirstName">
                          First name
                        </label>
                        <input
                          className="form-control"
                          id="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          value={formData.firstName || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="small mb-1" htmlFor="inputLastName">
                          Last name
                        </label>
                        <input
                          className="form-control"
                          id="lastName"
                          type="text"
                          placeholder="Enter your last name"
                          value={formData.lastName || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row gx-3 mb-3">
                      <div className="col-md-6">
                        <label className="small mb-1" htmlFor="inputPhone">
                          Phone number
                        </label>
                        <input
                          className="form-control"
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label
                          className="small mb-1"
                          htmlFor="inputEmailAddress"
                        >
                          Email address
                        </label>
                        <input
                          className="form-control"
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="password-change-section">
                      <h2 className="w-auto text-dark">Change password</h2>
                      <div className="mb-3">
                        <label
                          className="small mb-1"
                          htmlFor="inputOldPassword"
                        >
                          Old Password
                        </label>
                        <input
                          className="form-control"
                          id="oldPassword"
                          type="password"
                          placeholder="Enter your old password"
                          value={formData.oldPassword || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          className="small mb-1"
                          htmlFor="inputNewPassword"
                        >
                          New Password
                        </label>
                        <input
                          className="form-control"
                          id="newPassword"
                          type="password"
                          placeholder="Enter your new password"
                          value={formData.newPassword || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <button
                      className="btn delicious-btn"
                      onClick={checkData}
                      type="button"
                    >
                      Save changes
                    </button>

                    <a href="/">
                      <button
                        className="btn delicious-btn float-end"
                        type="button"
                      >
                        Logout
                      </button>
                    </a>
                  </form>
                  {successAlert && (
                    <div
                      id="errorAlertSuccess"
                      className="alert alert-success mt-3 alert-dismissible fade show"
                      role="alert"
                    >
                      <button
                        type="button"
                        className="btn btn-close"
                        data-bs-dismiss="alert"
                        onClick={() => setSuccessAlert(false)}
                      />
                      Changes saved successfully!
                    </div>
                  )}
                  {errorAlert && (
                    <div
                      id="errorAlert"
                      className="alert alert-danger mt-3 alert-dismissible fade show"
                      role="alert"
                    >
                      <button
                        type="button"
                        className="btn btn-close"
                        data-bs-dismiss="alert"
                        onClick={() => setErrorAlert(false)}
                      />
                      {errorMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row tab-pane fade" id="rentedMovies">
          <section className="recipe-section spad mt-5">
            <div className="container-fluid">
              <div className="recipe-category-buttons text-center my-3">
                <button
                  className={`btn delicious-btn mb-2 ${
                    selectedCategory === "All" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick("All")}
                >
                  All
                </button>
                {Object.keys(formData.favourites).map((category, index) => (
                  <button
                    key={index}
                    className={`btn delicious-btn mx-2 mb-2 ${
                      selectedCategory === category ? "active" : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Recipe Cards */}
              <div className="row">
                {currentRecipes.length > 0 ? (
                  currentRecipes.map((recipe, idx) => (
                    <div className="col-lg-4 col-sm-6 my-4" key={idx}>
                      <div className="recipe-item">
                        <a href="#">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="img-fluid"
                            onError={(e) => {
                              e.target.src = "/img/default_image.png"; // Fallback for broken image links
                            }}
                          />
                        </a>
                        <div className="ri-text text-center">
                          <a
                            href={`/recipeSingle/${username}/${recipe.title}`}
                            className="recipe-title-link"
                          >
                            <h5 className="text-dark">{recipe.title}</h5>
                          </a>
                          <div className="rating mt-2">
                            <span className="rating-stars-recipe">
                              {typeof recipe.rating === "number"
                                ? Array.from({ length: 5 }, (_, i) => {
                                    const fullStars = Math.floor(recipe.rating);
                                    const decimalPart =
                                      recipe.rating - fullStars;

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
                                      ); // Almost full star
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
                                      ); // Half star
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
                                    ></i>
                                  ))}
                            </span>
                            {typeof recipe.rating === "number" ? (
                              <span> ({recipe.rating.toFixed(1)})</span>
                            ) : (
                              <span> No rating given!!!</span>
                            )}
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
                    No favourites added yet :(
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredRecipes.length > recipesPerPage && (
                <div className="pagination-container text-center">
                  <nav>
                    <ul className="pagination justify-content-center">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li
                          key={i}
                          className={`page-item ${
                            i + 1 === currentPage ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </section>
        </div>
        <div className="row tab-pane fade" id="myRecipes">
          <section className="recipe-section spad mt-5">
            <div className="container-fluid">
              {/* Category Filter Buttons for user recipes */}
              <div className="recipe-category-buttons text-center my-3">
                <button
                  className={`btn delicious-btn mb-2 ${
                    selectedUserCategory === "All" ? "active" : ""
                  }`}
                  onClick={() => handleUserCategoryClick("All")}
                >
                  All
                </button>
                {[
                  ...new Set(
                    formData.user_recipes.map((recipe) => recipe.category)
                  ),
                ].map((category, index) => (
                  <button
                    key={index}
                    className={`btn delicious-btn mx-2 mb-2 ${
                      selectedUserCategory === category ? "active" : ""
                    }`}
                    onClick={() => handleUserCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Recipe Cards for user recipes */}
              <div className="row">
                {currentUserRecipes.length > 0 ? (
                  currentUserRecipes.map((recipe, idx) => (
                    <div className="col-lg-4 col-sm-6 my-4" key={idx}>
                      <div className="recipe-item">
                        <a href="#">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="img-fluid"
                            onError={(e) => {
                              e.target.src = "/img/default_image.png"; // Fallback for broken image links
                            }}
                          />
                        </a>
                        <div className="ri-text text-center">
                          <a
                            href={`/recipeSingle/${username}/${recipe.title}`}
                            className="recipe-title-link"
                          >
                            <h5 className="text-dark">{recipe.title}</h5>
                          </a>
                          <div className="rating mt-2">
                            <span className="rating-stars-recipe">
                              {typeof recipe.ratings === "number"
                                ? Array.from({ length: 5 }, (_, i) => {
                                    const fullStars = Math.floor(
                                      recipe.ratings
                                    );
                                    const decimalPart =
                                      recipe.ratings - fullStars;

                                    if (i < fullStars) {
                                      return (
                                        <i
                                          key={i}
                                          className="fas fa-star"
                                          style={{ color: "gold" }}
                                        ></i>
                                      );
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
                                      );
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
                                      );
                                    } else {
                                      return (
                                        <i
                                          key={i}
                                          className="far fa-star"
                                          style={{ color: "gold" }}
                                        ></i>
                                      );
                                    }
                                  })
                                : Array.from({ length: 5 }, (_, i) => (
                                    <i
                                      key={i}
                                      className="far fa-star"
                                      style={{ color: "gold" }}
                                    ></i>
                                  ))}
                            </span>
                            {typeof recipe.ratings === "number" ? (
                              <span> ({recipe.ratings.toFixed(1)})</span>
                            ) : (
                              <span> No rating given!!!</span>
                            )}
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
                    No recipes added yet :(
                  </div>
                )}
              </div>

              {/* Pagination for user recipes */}
              {filteredUserRecipes.length > userRecipesPerPage && (
                <div className="pagination-container text-center">
                  <nav>
                    <ul className="pagination justify-content-center">
                      {Array.from({ length: totalUserPages }, (_, i) => (
                        <li
                          key={i}
                          className={`page-item ${
                            i + 1 === currentUserPage ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginateUser(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </section>
        </div>
        <div className="row tab-pane fade" id="notifs">
          {Object.keys(formData.notifications).length > 0 ? (
            <div>
              {Object.entries(formData.notifications).map(([date, notifs], index) => (
                <div key={index} className="notification-date-section">
                  <h4>{date}</h4>
                  {notifs.map((notif, i) => (
                    <div key={i} className="notification-card">
                      <p>{notif}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-notifications">
              <p>No notifications available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileComp;
