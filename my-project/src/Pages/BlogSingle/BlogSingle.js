import React from 'react';
import Layout from '../../Layout/Layout';
import BlogPage from '../../Components/BlogPage/BlogPage';

const BlogSingle = () => {
  return (
    <Layout showPreloader={true} showNavbar={true} showFooter={true} validateUser={true}>
      <BlogPage />
    </Layout>
  );
};

export default BlogSingle;
