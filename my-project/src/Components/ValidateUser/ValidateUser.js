import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ValidateUser({ encryptedUsername }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const validateUser = async () => {
      try {
        const username = atob(encryptedUsername)
        const res = await fetch("https://delhavback.onrender.com/validateUser/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username }),
        });

        const data = await res.json();

        if (!data.success) {
          navigate("/pageNotFound");
        }
      } catch (error) {
        console.error("Error validating user:", error);
        navigate("/pageNotFound");
      }
    };

    validateUser();
  }, [encryptedUsername, navigate]);

  return null;
}

export default ValidateUser;
