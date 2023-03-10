import { Link } from "react-router-dom";

const Nav = ({ page }) => {
    const handleClick = () => {
        localStorage.setItem("token", null);
    };

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/login" onClick={handleClick}>
                        Déconnexion
                    </Link>
                </li>
                {page === "UpdatePost" && (
                    <li>
                        <Link to="/">Revenir aux messages</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Nav;
