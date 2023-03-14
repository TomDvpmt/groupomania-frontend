import logo from "../../assets/brand/icon-left-font.svg";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ nav }) => {
    const handleClick = () => {
        localStorage.setItem("token", null);
    };

    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="Groupomania logo" />
            {nav && (
                <nav>
                    <ul>
                        <li>
                            <Link to="/login" onClick={handleClick}>
                                Déconnexion
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;
