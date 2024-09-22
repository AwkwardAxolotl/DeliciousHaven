import React from "react";
import GoogleMapComponent from "../GoogleMapComponent/GoogleMapComponent";
import Newsletter from "../Newsletter/Newsletter";
import "./Contact.css";
import ContactForm from "../ContactForm/ContactForm";

export default function Contact() {
  return (
    <div>
      <div
        className="page-title bg-img bg-overlay mt-3"
        style={{ backgroundImage: "url(/img/breadcumb4.jpg)",overflowX:"hidden",height:"500px" }}
      >
        <div className=" h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12"> 
              <div className="breadcumb-text text-center">
                <h2>Contact Us</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-information-area section-padding-80 mx-5">
        <div>
          <div className="row">
            <div className="col-12">
              <div className="logo mb-80">
                <img src="/img/logo.png" alt="Logo" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-5">
              <div className="contact-text">
                <p>
                  Welcome to Delicious Food Blog! Here, we share our love for
                  cooking by providing a wide range of delicious recipes that
                  you can try at home. Whether you're a novice or an experienced
                  cook, we have something for everyone.
                </p>
                <p>
                  Our goal is to inspire you to create mouth-watering dishes
                  with simple ingredients and easy-to-follow instructions. If
                  you have any questions, suggestions, or just want to share
                  your cooking success stories, please don't hesitate to reach
                  out to us. We're here to help and love hearing from our
                  community!
                </p>
              </div>
            </div>

            <div className="col-12 col-lg-3">
              <div className="single-contact-information mb-30">
                <h6>Address:</h6>
                <p>
                  Recipe Haven, Flavor Street
                  <br />
                  Kitchen Suite 420
                </p>
              </div>

              <div className="single-contact-information mb-30">
                <h6>Phone:</h6>
                <p>
                  +123 456 789 1 <br />
                  +198 765 432 1
                </p>
              </div>

              <div className="single-contact-information mb-30">
                <h6>Email:</h6>
                <p>contact@recipehaven.com</p>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <Newsletter></Newsletter>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-area section-padding-0-80 mx-5">
        <div>
          <div className="row">
            <div className="col-12">
              <div className="contact-form-area">
                <ContactForm></ContactForm>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="map-area mb-5 mx-5">
        <GoogleMapComponent />
      </div>
    </div>
  );
}
