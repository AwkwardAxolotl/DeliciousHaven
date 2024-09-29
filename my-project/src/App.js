import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpIn from "./Pages/SignUpIn/SignUpIn";
import Otp from "./Pages/ForgotPassword/ForgotPassword";
import Home from "./Pages/Home/Home";
import ContactPage from "./Pages/ContactPage/ContactPage";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Blog from "./Pages/Blog/Blog";
import BlogSingle from "./Pages/BlogSingle/BlogSingle";
import Profile from "./Pages/Profile/Profile";
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import RecipesPage from "./Pages/RecipesPage/RecipesPage";
import Recipe from "./Pages/Recipe/Recipe";
import AddRecipe from "./Pages/AddRecipe/AddRecipe";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUpIn></SignUpIn>}></Route>
        <Route path="/forgotPassword" element={<Otp></Otp>}></Route>
        <Route path="/home/:username" element={<Home></Home>}></Route>
        <Route path="/contact/:username" element={<ContactPage />}></Route>
        <Route path="/about/:username" element={<AboutUs />}></Route>
        <Route path="/blog/:username" element={<Blog></Blog>}></Route>
        <Route
          path="/blog/:username/:encodedTitle"
          element={<BlogSingle />}
        ></Route>
        <Route path="/profile/:username" element={<Profile></Profile>}></Route>
        <Route path="/pageNotFound" element={<PageNotFound />}></Route>
        <Route path="/recipes/:username" element={<RecipesPage />}></Route>
        <Route
          path="/recipeSingle/:username/:recipeName"
          element={<Recipe />}
        ></Route>
        <Route path="/addRecipe/:username" element={<AddRecipe></AddRecipe>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
