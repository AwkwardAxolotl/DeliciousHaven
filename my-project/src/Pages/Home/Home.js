import React from "react";
import Layout from "../../Layout/Layout";
import HomePage from "../../Components/HomePage/HomePage";

export default function Home() {
  return (
    <>
      <Layout showPreloader={true} showNavbar={true} showFooter={true} validateUser={true}>
        <HomePage></HomePage>
      </Layout>
    </>
  );
}
