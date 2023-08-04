import "../App.css"; // We'll create this file to add custom styles
import image from "../img/headerBackground.png";

const Header = () => {
  // Get the current date and format it as 'Month day, year'
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="header" style={{ backgroundImage: `url(${image})` }}>
      <div className="name">Hello, John</div>
      <div className="current-date">{currentDate}</div>
    </div>
  );
};

export default Header;
