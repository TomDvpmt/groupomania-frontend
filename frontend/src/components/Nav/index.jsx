import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
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
        </nav>
    );
};

export default Nav;
