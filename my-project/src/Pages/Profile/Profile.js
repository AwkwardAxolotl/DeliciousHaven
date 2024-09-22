import React from "react";
import Layout from "../../Layout/Layout";
import ProfileComp from "../../Components/ProfileComp/ProfileComp";

const Profile = () => {
  return (
    <Layout showPreloader={true} showNavbar={true} showFooter={true} validateUser={true}>
      <ProfileComp></ProfileComp>
    </Layout>
  );
};

export default Profile;
