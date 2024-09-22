import React from "react";
import Layout from "../../Layout/Layout";
import BlogComp from "../../Components/BlogComp/BlogComp";

const Blog = () => {
  return (
    <Layout showPreloader={true} showNavbar={true} showFooter={true} validateUser={true}>
      <BlogComp></BlogComp>
    </Layout>
  );
};

export default Blog;
