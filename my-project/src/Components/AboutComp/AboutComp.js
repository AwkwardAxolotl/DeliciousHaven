import React, { useState } from "react";
import "./AboutComp.css";
import ContactForm from "../ContactForm/ContactForm";

export default function AboutComp() {
  return (
    <div>
      <div
        className="page-title bg-img bg-overlay"
        style={{
          backgroundImage: "url(/img/breadcumb1.jpg)",
          height: "500px",
          overflowX: "hidden",
        }}
      >
        <div className="h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12">
              <div className="breadcumb-text text-center">
                <h2>About Us</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="about-area section-padding-80 mx-5">
        <div>
          <div className="row">
            <div className="col-12">
              <div className="section-heading">
                <h3>Who We Are and What We Do?</h3>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h6 className="sub-heading pb-5">
                Welcome to Delicious Food Blog! We are passionate food lovers
                dedicated to sharing mouth-watering recipes and culinary tips.
                Our goal is to inspire and guide you in creating delicious meals
                for every occasion. Whether you are a beginner or an experienced
                cook, you'll find something here to tantalize your taste buds.
              </h6>

              <p className="text-center">
                At Delicious Food Blog, we believe that cooking should be fun,
                easy, and accessible to everyone. Our recipes are crafted with
                love and tested to perfection, ensuring you get the best results
                every time. From quick weekday dinners to elaborate weekend
                feasts, we have a wide range of recipes to suit all skill levels
                and tastes. Join us on this culinary adventure and let's create
                something delicious together!
              </p>
            </div>
          </div>

          <div className="row align-items-center mt-70">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="single-cool-fact">
                <img src="/img/salad.png" alt="Salad" />
                <h3>
                  <span className="counter">1287</span>
                </h3>
                <h6>Amazing Recipes</h6>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="single-cool-fact">
                <img src="/img/hamburger.png" alt="Hamburger" />
                <h3>
                  <span className="counter">25</span>
                </h3>
                <h6>Burger Recipes</h6>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="single-cool-fact">
                <img src="/img/rib.png" alt="Rib" />
                <h3>
                  <span className="counter">471</span>
                </h3>
                <h6>Meat Recipes</h6>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="single-cool-fact">
                <img src="/img/pancake.png" alt="Pancake" />
                <h3>
                  <span className="counter">326</span>
                </h3>
                <h6>Dessert Recipes</h6>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 text-center">
              <img className="mb-70" src="/img/about.png" alt="About Us" />
              <p className="text-center">
                At Delicious Food Blog, we are more than just a collection of
                recipes. We are a community of food enthusiasts who love to
                explore new flavors and techniques. Our team is committed to
                bringing you fresh, innovative recipes that are easy to follow
                and produce stunning results. Whether you're looking for healthy
                meal ideas, indulgent desserts, or tips on mastering the basics,
                we've got you covered. Thank you for being a part of our
                journey. Let's cook something amazing today!
              </p>
            </div>
          </div>
        </div>
      </section>
      <ContactForm></ContactForm>
    </div>
  );
}
