import React, { useState } from "react";
import "./ProfileImageUpload.css";

const ProfileImageUpload = ({ username, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const dismissErrorAlert = () => {
    setErrorMessage(null);
  };

  const dismissSuccessAlert = () => {
    setUploadSuccess(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("username", username);

    try {
      const res = await fetch("https://delhavback.onrender.com/uploadProfileImage/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadSuccess(true);
        setErrorMessage("");
        onUploadSuccess(data.file_path); // Notify parent component of the new image path
      } else {
        setUploadSuccess(false);
        setErrorMessage(data.error || "Failed to upload image.");
      }
    } catch (error) {
      setUploadSuccess(false);
      setErrorMessage("An error occurred during upload.");
    }
  };

  return (
    <div className="profile-image-upload">
      <label htmlFor="file-upload" className="custom-file-upload">
        Choose File
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {selectedFile && <span className="file-name">{selectedFile.name}</span>}
      <button onClick={handleUpload} className="btn-upload">
        Upload Image
      </button>
      {uploadSuccess && (
        <div className="alert alert-success mt-3" role="alert">
          Image uploaded successfully!
          <button className="btn-close" onClick={dismissSuccessAlert}></button>
        </div>
      )}
      {errorMessage && (
        <div className={`alert error`}>
          <h3>{errorMessage}</h3>
          <button onClick={dismissErrorAlert} className="close-button">
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;
