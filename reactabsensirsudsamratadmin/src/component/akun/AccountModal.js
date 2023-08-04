import React, { useState } from "react";
import pPicture from "../../img/ProfilePicture.png";
import uploadButton from "../../img/uploadButton.png";
import hidePassLogo from "../../img/hide-password.png";
import viewPassLogo from "../../img/view-password.png";

const AccountModal = ({ setModal }) => {
  const [name, setName] = useState("");
  const [nik, setNik] = useState("");
  const [bidang, setBidang] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordLogo = () => {
    setShowPassword(!showPassword);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "nik":
        setNik(value);
        break;
      case "bidang":
        setBidang(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="modal">
      <div onClick={setModal} className="overlay"></div>
      <div className="modal-content">
        <div className="input-container">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="nik"
            placeholder="NIK"
            value={nik}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="bidang"
            placeholder="Bidang / Jabatan"
            value={bidang}
            onChange={handleInputChange}
          />
          <div className="CreateAccount-password">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleInputChange}
            />
            <button onClick={handlePasswordLogo}>
              <img
                src={showPassword ? hidePassLogo : viewPassLogo}
                alt="view-hide-password-logo"
              />
            </button>
          </div>
        </div>

        <div className="profile-container">
          <div className="picture-and-upload-container">
            <img
              src={pPicture}
              alt="Profile"
              className="CreateAccount-profile-picture"
            />
            <button>
              <img
                src={uploadButton}
                alt="upload-logo"
                className="CreateAccount-upload-logo"
              />
            </button>
          </div>
          <button className="CreateAccount-create-button">Create</button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
