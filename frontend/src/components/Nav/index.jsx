import { Link, useNavigate } from "react-router-dom";

const Nav = ({ page }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        localStorage.setItem("token", null);
        navigate("/login");
    };

    return (
        <nav>
            <Link to="/login" onClick={handleClick}>
                Déconnexion
            </Link>
            {page === "UpdatePost" && <Link to="/">Revenir aux messages</Link>}
        </nav>
    );
};

export default Nav;
