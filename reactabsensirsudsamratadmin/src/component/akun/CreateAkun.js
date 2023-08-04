import "../../App.css"; // We'll create this file to add custom styles
import CreateAkunLogo from "../../img/Vector.png";
import AccountModal from "./AccountModal";
import React, { useState } from "react";

const CreateAkun = () => {
  const [isOpen, setIsOpen] = useState(false);

  const setModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="CreateAccount-mainContainer">
      <div className="CreateAccount">
        <h1>Account Users</h1>
        <div className="CreateAccount-button">
          <button onClick={setModal}>
            <img src={CreateAkunLogo} alt="logo-create-akun" />
          </button>
          <p>Create Akun</p>
        </div>
        {isOpen && <AccountModal setModal={setModal} />}
      </div>
      <input
        type="text"
        className="CreateAccount-search-bar"
        placeholder="Cari..."
      />
    </div>
  );
};

export default CreateAkun;
