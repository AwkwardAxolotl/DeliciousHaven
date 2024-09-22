import React from 'react';
import Layout from '../../Layout/Layout';
import Contact from "../../Components/Contact/Contact"

const ContactPage = () => {
  return (
    <Layout showPreloader={true} showNavbar={true} showFooter={true} validateUser={true}>
      <Contact />
    </Layout>
  );
};

export default ContactPage;
