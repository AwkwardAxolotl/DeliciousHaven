import React, { useState } from "react";
import './RecipeForm.css'; // Custom styles

const RecipeForm = () => {
  const [ingredients, setIngredients] = useState([{ id: Date.now(), value: "" }]);
  const [directions, setDirections] = useState([{ id: Date.now(), value: "" }]);
  const [details, setDetails] = useState([{ id: Date.now(), name: "", value: "" }]);
  
  // For displaying alerts
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });

  // Add Ingredient
  const addIngredient = () => setIngredients([...ingredients, { id: Date.now(), value: "" }]);
  // Remove Ingredient
  const removeIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    }
  };

  // Add Direction
  const addDirection = () => setDirections([...directions, { id: Date.now(), value: "" }]);
  // Remove Direction
  const removeDirection = (id) => {
    if (directions.length > 1) {
      setDirections(directions.filter(direction => direction.id !== id));
    }
  };

  // Add Detail
  const addDetail = () => setDetails([...details, { id: Date.now(), name: "", value: "" }]);
  // Remove Detail
  const removeDetail = (id) => {
    if (details.length > 1) {
      setDetails(details.filter(detail => detail.id !== id));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation
    const hasEmptyIngredients = ingredients.some(ingredient => ingredient.value.trim() === "");
    const hasEmptyDirections = directions.some(direction => direction.value.trim() === "");
    const hasEmptyDetails = details.some(detail => detail.name.trim() === "" || detail.value.trim() === "");

    if (hasEmptyIngredients) {
      setAlert({
        type: "danger",
        message: "Please fill out all the ingredients.",
        visible: true,
      });
      return;
    }

    if (hasEmptyDirections) {
      setAlert({
        type: "danger",
        message: "Please fill out all the directions.",
        visible: true,
      });
      return;
    }

    if (hasEmptyDetails) {
      setAlert({
        type: "danger",
        message: "Please fill out all the details (both name and value).",
        visible: true,
      });
      return;
    }

    // If no validation errors
    setAlert({
      type: "success",
      message: "Form submitted successfully!",
      visible: true,
    });

    console.log("Form data:", { ingredients, directions, details });
  };

  return (
    <div className="recipe-form-container">
      {alert.visible && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="close" aria-label="Close" onClick={() => setAlert({ ...alert, visible: false })}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="recipe-form">
        <h1 className="form-heading">Add a Recipe</h1>

        <div className="input-group">
          <label htmlFor="recipeTitle"><h3>Title</h3></label>
          <input type="text" id="recipeTitle" name="recipeTitle" required />
        </div>

        <div className="input-group">
          <label htmlFor="recipeCategory"><h3>Category</h3></label>
          <input type="text" id="recipeCategory" name="recipeCategory" required />
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
                onChange={(e) => {
                  const newIngredients = [...ingredients];
                  newIngredients[index].value = e.target.value;
                  setIngredients(newIngredients);
                }}
              />
              {ingredients.length > 1 && (
                <button type="button" className="btn-close" onClick={() => removeIngredient(ingredient.id)}></button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn btn btn-primary" onClick={addIngredient}>Add another Ingredient</button>
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
                onChange={(e) => {
                  const newDirections = [...directions];
                  newDirections[index].value = e.target.value;
                  setDirections(newDirections);
                }}
              />
              {directions.length > 1 && (
                <button type="button" className="btn-close" onClick={() => removeDirection(direction.id)}></button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn btn btn-primary" onClick={addDirection}>Add another Direction</button>
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
                onChange={(e) => {
                  const newDetails = [...details];
                  newDetails[index].name = e.target.value;
                  setDetails(newDetails);
                }}
              />
              <input
                type="text"
                placeholder="Detail value"
                value={detail.value}
                onChange={(e) => {
                  const newDetails = [...details];
                  newDetails[index].value = e.target.value;
                  setDetails(newDetails);
                }}
              />
              {details.length > 1 && (
                <button type="button" className="btn-close" onClick={() => removeDetail(detail.id)}></button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn btn btn-primary" onClick={addDetail}>Add another Detail</button>
        </div>

        <input type="submit" className="submit-btn btn btn-success" value="Submit" />
      </form>
    </div>
  );
};

export default RecipeForm;
