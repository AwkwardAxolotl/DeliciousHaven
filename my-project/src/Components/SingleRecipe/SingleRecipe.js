import React, { useEffect, useState } from "react";
import "./SingleRecipe.css";
import { useParams } from "react-router-dom";

export default function SingleRecipe() {
  const [visRat, setVisRat] = useState(false);
  const { username, recipeName } = useParams();
  const [isFav, setIsFav] = useState(false);
  const [userRecipe, setUserRecipe] = useState(false);
  
  const [recipe, setRecipe] = useState({
    category: "",
    title: "",
    ingredients: [],
    details: {},
    directions: [],
    rating: null,
    total_reviews: 0,
    image: "",
    comments: [],
    reviews: {},
  });
  const [comment, setComment] = useState("");
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [userRating, setUserRating] = useState(null); // Track user's rating
  const [hoverRating, setHoverRating] = useState(null); // Track hover state
  const [ratingDescription, setRatingDescription] = useState("");
  const [userHasRated, setUserHasRated] = useState(false);

  const ratingDescriptions = [
    "Awful - This recipe didn't turn out well at all.",
    "Not Great - Something was off, it could be better.",
    "Okay - It was fine, but nothing special.",
    "Good - This was tasty and I'd make it again.",
    "Excellent - Absolutely delicious, a must-try recipe!",
  ];

  const fetchRecipe = async () => {
    try {
      const res = await fetch("https://del-hav-back-i9qh7hu0y-krashnas-projects.vercel.app/getSingleRecipe/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: recipeName, username: atob(username) }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      if (data.success) {
        setRecipe(data.recipe);
        setRandomRecipes(data.randomRecipes);
        setIsFav(data.fav);
        setUserRecipe(data.user_recipe);
        if (data.recipe.reviews && atob(username) in data.recipe.reviews) {
          setUserRating(data.recipe.reviews[atob(username)]);
          setUserHasRated(true);
        }
      } else {
        console.log("Error: Recipe not found or another issue occurred");
      }
    } catch (error) {
      console.error("Error fetching the recipe:", error);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [recipeName]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date().toLocaleDateString("en-US", options);
    const res = await fetch("https://del-hav-back-i9qh7hu0y-krashnas-projects.vercel.app/addComment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: recipe["username"] ? atob(recipe["username"]) : "",
        comment: comment,
        title: recipe.title,
        time: formattedDate,
        username: atob(username),
        userRecipe,
        recipe: true,
      }),
    });
    const data = await res.json();
    if (data.success) {
      const newComment = {
        username: atob(username),
        time: formattedDate,
        comment: comment,
      };

      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        comments: [...prevRecipe.comments, newComment],
      }));
    } else {
      console.log("Error:" + data.error);
    }
  };

  const handleRatingSubmit = async (rating) => {
    if (userHasRated) return;
    try {
      setHoverRating(rating);
      setVisRat(true);
      setUserRating(rating);
      setRatingDescription(ratingDescriptions[rating - 1]);

      const res = await fetch("https://del-hav-back-i9qh7hu0y-krashnas-projects.vercel.app/ratings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: recipe["username"] ? atob(recipe["username"]) : "",
          title: recipe.title,
          username: atob(username),
          rating: rating,
          userRecipe,
        }),
      });

      if (!res.ok) {
        console.log(res);
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      if (data.success) {
        setRecipe((prevRecipe) => ({
          ...prevRecipe,
          rating: data.rating,
          total_reviews: data.total_reviews,
        }));
        setUserHasRated(true);
      } else {
        console.log("Error updating rating:", data.error);
      }
    } catch (error) {
      setVisRat(false);
      console.error("Error submitting the rating:", error);
    }
  };

  const removeFromFavourites = async (category) => {
    try {
      const res = await fetch("https://del-hav-back-i9qh7hu0y-krashnas-projects.vercel.app/removeFromFavourites/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeName,
          category,
          username: atob(username),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsFav(false);
      }
    } catch (error) {}
  };

  const handleFavourites = async (category) => {
    try {
      const res = await fetch("https://del-hav-back-i9qh7hu0y-krashnas-projects.vercel.app/addToFavourites/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeName,
          category,
          username: atob(username),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsFav(true);
      }
    } catch (error) {}
  };

  const handlePrint = () => {
    window.print();
  };

  const isRated = () => {
    return atob(username) in recipe.reviews;
  };

  return (
    <>
      <section className="single-page-recipe spad">
        <div className="recipe-top">
          <div className="container-fluid">
            <div className="recipe-title">
              <h2 className="text-capitalize">{recipe.title}</h2>
              <ul className="tags">
                <li className="fs-3">{recipe.category}</li>
              </ul>
            </div>

            <img
              src="/img/chef.jpg"
              alt={recipe.title}
              className="recipe-img"
            />
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-5">
              <div className="ingredients-item">
                <div className="intro-item">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="img-rounded"
                  />
                  <h2>{recipe.title}</h2>
                  {recipe["upload_date"] && (
                    <p>
                      Published by {atob(recipe["username"])} on{" "}
                      {recipe["upload_date"]}
                    </p>
                  )}
                  <div className="rating">
                    <span className="rating-stars">
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
                              );
                            } else if (i === fullStars && decimalPart >= 0.75) {
                              return (
                                <i
                                  key={i}
                                  className="fas fa-star"
                                  style={{ color: "gold" }}
                                ></i>
                              );
                            } else if (i === fullStars && decimalPart >= 0.25) {
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
                            ></i> // Display 0 stars if no rating is given
                          ))}
                    </span>
                  </div>
                  <div className="recipe-time">
                    <ul>
                      {recipe.details &&
                        Object.entries(recipe.details).map(([key, value]) => (
                          <li key={key}>
                            {key} <span>{value}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <div className="ingredient-list">
                  <div className="recipe-btn mx-5">
                    <button onClick={handlePrint}> Print Recipe </button>
                    {isFav ? (
                      <button
                        className="black-btn"
                        onClick={() => removeFromFavourites(recipe.category)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        className="black-btn"
                        onClick={() => handleFavourites(recipe.category)}
                      >
                        Favorites
                      </button>
                    )}
                  </div>
                  <div className="list-item">
                    <h5>Ingredients</h5>
                    <div className="salad-list">
                      <ul>
                        {recipe.ingredients &&
                          recipe.ingredients.map((ing, index) => (
                            <li key={index}>{ing}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nutrition-fact">
                <div className="nutri-title">
                  <h6>Nutrition Facts</h6>
                  <span>
                    Serves {recipe.details && recipe.details["Servings:"]}
                  </span>
                </div>
                <ul>
                  <li>Total Fat : 20.4g</li>
                  <li>Cholesterol : 2%</li>
                  <li>Calories: 345</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="recipe-right">
                <div className="recipe-desc">
                  <h3>Description</h3>
                  <p>
                    This delicious {recipe.title} is a perfect dish for any
                    occasion. Whether you're cooking for your family or hosting
                    a dinner party, this recipe brings together a delightful
                    combination of flavors and textures. It's not only
                    satisfying but also easy to prepare, making it a go-to
                    recipe for busy weeknights or leisurely weekends.
                  </p>
                  <p>
                    The {recipe.category} cuisine truly shines through in this
                    dish, offering a wonderful balance of ingredients that
                    complement each other perfectly. From the fresh{" "}
                    {recipe.ingredients ? recipe.ingredients.join(", ") : ""} to
                    the carefully chosen spices, each element of this recipe
                    contributes to its overall deliciousness.
                  </p>
                </div>
                <div className="instruction-list">
                  <h3>Instructions</h3>
                  <ul>
                    {recipe.directions &&
                      recipe.directions.map((dir, index) => (
                        <li key={index}>
                          <span>{String(index + 1).padStart(2, "0")}.</span>
                          {dir}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="notes">
                  <h3>Notes</h3>
                  <div className="notes-item">
                    <span>i</span>
                    <p>
                      For best results, make sure to use fresh ingredients.
                      Adjust seasoning according to taste. This recipe is
                      versatile and can be customized with your favorite
                      vegetables or protein.
                    </p>
                  </div>
                  <div className="notes-item">
                    <span>i</span>
                    <p>
                      If you're short on time, certain steps can be done ahead
                      of time, such as prepping the ingredients or marinating
                      the meat. This will help you save time and have the dish
                      ready more quickly.
                    </p>
                  </div>
                  <div className="notes-item">
                    <span>i</span>
                    <p>
                      This dish pairs wonderfully with a side of fresh salad or
                      a light soup. Don't forget to enjoy it with your favorite
                      beverage!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isRated() && visRat ? (
          <div></div>
        ) : (
          <div className="rating-section">
            <h3>Your Rating</h3>
            <div className="rating-stars">
              {/* Disable further rating if the user has already rated */}
              {userHasRated
                ? Array.from({ length: 5 }, (_, i) => (
                    <i
                      key={i}
                      className={`star ${userRating > i ? "filled" : ""}`}
                      style={{ color: userRating > i ? "gold" : "gray" }}
                    >
                      ★
                    </i>
                  ))
                : [1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`star ${userRating >= star ? "filled" : ""}`}
                      onClick={() => handleRatingSubmit(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      style={{ color: hoverRating >= star ? "gold" : "gray" }}
                    >
                      ★
                    </i>
                  ))}
            </div>
            <p className="rating-description">{ratingDescription}</p>
          </div>
        )}
        <div className="col-lg-12 mb-5">
          <div className="comment-area card border-0 p-5">
            <h4 className="comments-title">
              {recipe.comments.length} Comments
            </h4>
            {recipe.comments.length > 0 ? (
              <ul className="comment-tree list-unstyled">
                {recipe.comments.map((comment, index) => (
                  <li className="mb-5" key={index}>
                    <div className="comment-area-box">
                      <img
                        alt=""
                        src={"/profile_pics/" + comment.username + ".jpg"}
                        className="mt-2 img-fluid float-start me-3 rounded"
                        height="20"
                        onError={(e) => {
                          e.target.src =
                            "https://assets-in.bmscdn.com/static/2023/10/default-pic.png";
                        }}
                      />

                      <h5 className="comment-author">{comment.username}</h5>
                      <span className="comment-location">India</span>

                      <div className="comment-meta mt-4 mt-lg-0 mt-md-0 float-lg-end float-md-end">
                        <span className="date-comm">Posted {comment.time}</span>
                      </div>

                      <div className="comment-content mt-3">
                        <p>{comment.comment}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>

        <div className="col-lg-12">
          <form
            className="contact-form bg-white rounded p-5"
            id="comment-form"
            onSubmit={handleSubmit}
          >
            <h4 className="form-title">Write a comment</h4>
            <textarea
              className="form-control mb-3"
              name="comment"
              id="comment"
              cols="30"
              rows="5"
              value={comment}
              placeholder="Comment"
              onChange={(evt) => {
                setComment(evt.target.value);
              }}
            ></textarea>

            <input
              className="btn btn-main rounded-pill"
              type="submit"
              name="submit-contact"
              id="submit_contact"
              value="Submit Message"
            />
          </form>
        </div>
      </section>

      <section className="similar-recipe spad">
        <div className="container-fluid">
          <div className="row">
            {randomRecipes.map((re) => (
              <div className="col-lg-3 col-md-6" key={re.title}>
                <div className="similar-item">
                  <a href={"/recipeSingle/" + username + "/" + re.title}>
                    <img
                      src={re["image"]}
                      alt=""
                      width={"99px"}
                      height={"75px"}
                      onError={(e) => {
                        e.target.src = "/img/default_image.png";
                      }}
                    />
                  </a>
                  <div className="similar-text">
                    <div className="cat-name">{re["category"]}</div>
                    <h6>{re["title"]}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
