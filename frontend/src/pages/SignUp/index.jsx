import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
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
                <input
                    type="password"
                    name="passwordConfirm"
                    placeholder="Confirmez votre mot de passe"
                />
                <button>Sign up</button>
            </form>
            <Link to="/login">Déjà un compte ? S'identifier</Link>
        </React.Fragment>
    );
};

export default SignUp;
