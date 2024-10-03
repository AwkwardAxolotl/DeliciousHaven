import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./RecipeForm.css"; // Custom styles

const RecipeForm = () => {
  const { username } = useParams();
  const [recipeImage, setRecipeImage] = useState(null);
  const [ingredients, setIngredients] = useState([
    { id: Date.now(), value: "" },
  ]);
  const [directions, setDirections] = useState([{ id: Date.now(), value: "" }]);
  const [details, setDetails] = useState([
    { id: 1, name: "Prep Time:", value: "" },
    { id: 2, name: "Cook Time:", value: "" },
    { id: 3, name: "Total Time:", value: "" },
    { id: 4, name: "Servings:", value: "" },
  ]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const [alert, setAlert] = useState({ type: "", message: "", visible: false });

  const handleImageChange = (e) => {
    setRecipeImage(e.target.files[0]);
  };

  const addIngredient = () =>
    setIngredients([...ingredients, { id: Date.now(), value: "" }]);

  const removeIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    }
  };

  const addDirection = () =>
    setDirections([...directions, { id: Date.now(), value: "" }]);

  const removeDirection = (id) => {
    if (directions.length > 1) {
      setDirections(directions.filter((direction) => direction.id !== id));
    }
  };

  const addDetail = () =>
    setDetails([...details, { id: Date.now(), name: "", value: "" }]);

  const removeDetail = (id) => {
    if (details.length > 1) {
      setDetails(details.filter((detail) => detail.id !== id));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform validation
    const hasEmptyIngredients = ingredients.some(
      (ingredient) => ingredient.value.trim() === ""
    );
    const hasEmptyDirections = directions.some(
      (direction) => direction.value.trim() === ""
    );
    const hasEmptyDetails = details.some(
      (detail) => detail.name.trim() === "" || detail.value.trim() === ""
    );

    if (!title || !category) {
      setAlert({
        type: "danger",
        message: "Please fill out all inputs.",
        visible: true,
      });
      return;
    }
    if (hasEmptyIngredients || hasEmptyDirections || hasEmptyDetails) {
      setAlert({
        type: "danger",
        message: "Please fill out all fields.",
        visible: true,
      });
      return;
    }

    // Transform ingredients and directions to arrays of values
    const ingredientsArray = ingredients.map((ingredient) => ingredient.value);
    const directionsArray = directions.map((direction) => direction.value);

    // Transform details to an object where name is the key and value is the value
    const detailsObject = details.reduce((acc, detail) => {
      acc[detail.name] = detail.value;
      return acc;
    }, {});

    // Prepare the form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("username", username);
    formData.append("recipeImage", recipeImage);
    formData.append("ingredients", JSON.stringify(ingredientsArray)); // Send as JSON array
    formData.append("directions", JSON.stringify(directionsArray)); // Send as JSON array
    formData.append("details", JSON.stringify(detailsObject)); // Send as JSON object

    try {
      const response = await fetch("https://del-hav-back-gkh2xx6ly-krashnas-projects.vercel.app/addRecipe/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          type: "success",
          message: "Recipe submitted successfully!",
          visible: true,
        });
      } else {
        setAlert({
          type: "danger",
          message: data.error || "Failed to submit recipe.",
          visible: true,
        });
      }
    } catch (error) {
      setAlert({
        type: "danger",
        message: "An error occurred during submission.",
        visible: true,
      });
    }
  };

  return (
    <div className="recipe-form-container">
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-heading-container">
          <h1 className="form-heading mb-4">Add a Recipe</h1>
        </div>

        <div className="input-group">
          <label htmlFor="recipeTitle">
            <h3>Title</h3>
          </label>
          <input
            type="text"
            id="recipeTitle"
            name="recipeTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="recipeCategory">
            <h3>Category</h3>
          </label>
          <input
            type="text"
            id="recipeCategory"
            name="recipeCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <hr />

        <div className="section">
          <h3>Ingredients</h3>
          {ingredients.map((ingredient, index) => (
            <div key={ingredient.id} className="input-group">
              <input
                type="text"
                placeholder="Add ingredient"
                value={ingredient.value}
                onChange={(e) =>
                  setIngredients(
                    ingredients.map((ing, i) =>
                      i === index ? { ...ing, value: e.target.value } : ing
                    )
                  )
                }
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => removeIngredient(ingredient.id)}
                ></button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-btn btn btn-primary"
            onClick={addIngredient}
          >
            Add another Ingredient
          </button>
        </div>

        <hr />

        <div className="section">
          <h3>Directions</h3>
          {directions.map((direction, index) => (
            <div key={direction.id} className="input-group">
              <input
                type="text"
                placeholder="Add direction"
                value={direction.value}
                onChange={(e) =>
                  setDirections(
                    directions.map((dir, i) =>
                      i === index ? { ...dir, value: e.target.value } : dir
                    )
                  )
                }
              />
              {directions.length > 1 && (
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => removeDirection(direction.id)}
                ></button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-btn btn btn-primary"
            onClick={addDirection}
          >
            Add another Direction
          </button>
        </div>

        <hr />

        <div className="section">
          <h3>Details</h3>
          {details.map((detail, index) => (
            <div key={detail.id} className="input-group">
              <input
                type="text"
                placeholder="Detail name"
                value={detail.name}
                disabled={detail.id <= 4} // Disable name input for compulsory fields
              />
              <input
                type="text"
                placeholder="Detail value"
                value={detail.value}
                className="mt-2"
                onChange={(e) =>
                  setDetails(
                    details.map((det, i) =>
                      i === index ? { ...det, value: e.target.value } : det
                    )
                  )
                }
              />
              {detail.id > 4 && (
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => removeDetail(detail.id)}
                ></button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-btn btn btn-primary"
            onClick={addDetail}
          >
            Add another Detail
          </button>
        </div>

        <div className="input-group image-upload-group">
          <label htmlFor="recipeImage">Recipe Image</label>
          <div className="custom-file-upload">
            <label htmlFor="recipeImage" className="upload-btn">
              Choose File
            </label>
            <input
              type="file"
              id="recipeImage"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {recipeImage && (
              <span className="file-name">{recipeImage.name}</span>
            )}
          </div>
          {recipeImage && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(recipeImage)}
                alt="Recipe Preview"
              />
            </div>
          )}
        </div>
        <input
          type="submit"
          className="submit-btn btn btn-success"
          value="Submit"
        />
        {alert.visible && (
          <div
            className={`alert alert-${alert.type} alert-dismissible custom-alert mt-4`}
            role="alert"
          >
            {alert.message}
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={() => setAlert({ ...alert, visible: false })}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default RecipeForm;
