import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import FootComp from "../Components/FootComp/FootComp";
import Preloader from "../Components/Preloader/Preloader";
import ValidateUser from "../Components/ValidateUser/ValidateUser";
import { useParams } from "react-router-dom";

const Layout = ({
  children,
  showPreloader = true,
  showNavbar = true,
  showFooter = true,
  validateUser = true,
}) => {
  const { username } = useParams();
  return (
    <>
      {showPreloader && <Preloader />}
      {validateUser && <ValidateUser encryptedUsername={username} />}
      {showNavbar && <Navbar/>}
      {children}
      {showFooter && <FootComp />}
    </>
  );
};

export default Layout;
