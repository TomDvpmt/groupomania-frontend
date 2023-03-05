import logo from "../../assets/brand/icon-left-font.svg";
import "./Header.css";

const Header = () => {
    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="Groupomania logo" />
        </header>
    );
};

export default Header;
