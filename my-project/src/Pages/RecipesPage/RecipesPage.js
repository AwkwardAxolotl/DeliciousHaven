import React from "react";
import Layout from "../../Layout/Layout";
import Recipes from "../../Components/Recipes/Recipes";

const RecipesPage = () => {
  return (
    <Layout showPreloader={true} showNavbar={true} showFooter={true} validateUser={true}>
      <Recipes></Recipes>
    </Layout>
  );
};

export default RecipesPage;
