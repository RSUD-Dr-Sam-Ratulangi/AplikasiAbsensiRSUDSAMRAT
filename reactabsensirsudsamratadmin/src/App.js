import "./App.css";
import { useReducer, useState } from "react";
import LeftSide from "./component/LeftSide";
import Dashboard from "./component/MainBody";
import { reducer, initialState } from "./component/reducer";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeButtonId, setActiveButtonId] = useState(2);

  const handleClick = (id) => {
    dispatch({ type: "CLICK_BUTTON", payload: id });
    setActiveButtonId(id);
  };

  return (
    <div className="App">
      <LeftSide
        state={state}
        dispatch={dispatch}
        activeButtonId={activeButtonId}
        handleClick={handleClick}
      />
      <Dashboard activeButtonId={activeButtonId} />
    </div>
  );
}

export default App;
