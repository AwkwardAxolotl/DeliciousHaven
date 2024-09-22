// AboutUs.js
import React from "react";
import Layout from "../../Layout/Layout";
import AboutComp from "../../Components/AboutComp/AboutComp";

const AboutUs = () => {
  return (
    <Layout
      showPreloader={true}
      showNavbar={true}
      showFooter={true}
      validateUser={true}
    >
      <AboutComp />
    </Layout>
  );
};

export default AboutUs;
