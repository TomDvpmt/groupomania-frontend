import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Entrez votre adresse e-mail"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Entrez votre mot de passe"
                />
                <button>Login</button>
            </form>
            <Link to="/signup">Créer un compte</Link>
        </React.Fragment>
    );
};

export default Login;
