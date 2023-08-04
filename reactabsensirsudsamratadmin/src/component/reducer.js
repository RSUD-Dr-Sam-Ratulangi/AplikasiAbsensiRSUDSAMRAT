import absensi from "../img/absensi.png";
import akun from "../img/akun.png";
import dasbor from "../img/dasbor.png";

export const initialState = {
  buttons: [
    {
      id: 1,
      text: "Dasbor",
      image: dasbor,
      altprop: "logo-akun",
      clicked: false,
    },
    {
      id: 2,
      text: "Absensi",
      image: absensi,
      altprop: "logo-akun",
      clicked: false,
    },
    {
      id: 3,
      text: "Akun",
      image: akun,
      altprop: "logo-akun",
      clicked: false,
    },
  ],
};

export const reducer = (state, action) => {
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
