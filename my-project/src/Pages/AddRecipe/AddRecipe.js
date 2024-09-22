import React from "react";
import Layout from "../../Layout/Layout";
import RecipeForm from "../../Components/RecipeForm/RecipeForm";

const AddRecipe = () => {
  return (
    <Layout
      showPreloader={true}
      showNavbar={true}
      showFooter={true}
      validateUser={false}
    >
      <RecipeForm />
    </Layout>
  );
};

export default AddRecipe;
