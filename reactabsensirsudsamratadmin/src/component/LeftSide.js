import "../App.css";
import Logo from "../img/Main-Logo.png";

const LeftSide = ({ state, handleClick }) => {
  return (
    <div className="left-side">
      <img src={Logo} alt="Logo" className="logo" />
      <div className="button-container">
        {state.buttons.map((button) => (
          <button
            key={button.id}
            className={`button-change-color ${button.clicked ? "clicked" : ""}`}
            onClick={() => handleClick(button.id)}
          >
            <img
              src={button.image}
              alt={button.altprop}
              className={button.clicked ? "img-clicked" : ""}
            />
            {button.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeftSide;
