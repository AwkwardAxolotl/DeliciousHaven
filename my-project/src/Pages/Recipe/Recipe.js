import React from "react";
import Layout from "../../Layout/Layout";
import SingleRecipe from "../../Components/SingleRecipe/SingleRecipe";

const Recipe = () => {
  return (
    <Layout showPreloader={true} showNavbar={true} showFooter={true} validateUser={true}>
      <SingleRecipe></SingleRecipe>
    </Layout>
  );
};

export default Recipe;
