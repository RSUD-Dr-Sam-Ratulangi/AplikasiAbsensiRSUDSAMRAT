import "../../App.css"; // We'll create this file to add custom styles
import React, { useReducer } from "react";

const initialState = {
  buttons: [
    {
      id: 1,
      text: "Terkini",
      clicked: false,
    },
    {
      id: 2,
      text: "Pagi",
      clicked: false,
    },
    {
      id: 3,
      text: "Siang",
      clicked: false,
    },
    {
      id: 4,
      text: "Malam",
      clicked: false,
    },
  ],
};
const reducer = (state, action) => {
  switch (action.type) {
    case "CLICK_BUTTON":
      return {
        ...state,
        buttons: state.buttons.map((button) =>
          button.id === action.payload
            ? { ...button, clicked: true }
            : { ...button, clicked: false }
        ),
      };
    default:
      return state;
  }
};

const Search = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleClick = (id) => {
    dispatch({ type: "CLICK_BUTTON", payload: id });
  };

  return (
    <div className="search">
      <div className="title">Absen Hari Ini</div>
      <div className="buttonSearch-container">
        {state.buttons.map((button) => (
          <button
            key={button.id}
            className={`buttonSearch-element ${
              button.clicked ? "clicked-buttonSearch" : ""
            }`}
            onClick={() => handleClick(button.id)}
          >
            {button.text}
          </button>
        ))}
      </div>
      <input type="text" className="search-bar" placeholder="Cari..." />
    </div>
  );
};

export default Search;
