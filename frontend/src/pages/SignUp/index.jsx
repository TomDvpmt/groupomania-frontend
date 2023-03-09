import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCredentials } from "../../utils";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        }
        if (e.target.name === "password") {
            setPassword(e.target.value);
        }
        if (e.target.name === "passwordConfirm") {
            setPasswordConfirm(e.target.value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === passwordConfirm) {
            const signUpData = {
                email: email,
                password: password,
            };

            fetchCredentials("signup", signUpData)
                .then((response) => {
                    if (response.status >= 400) {
                        response
                            .json()
                            .then(({ message }) => setErrorMessage(message));
                    } else {
                        response.json().then(({ token }) => {
                            localStorage.setItem("token", token);
                            navigate("/");
                        });
                    }
                })
                .catch((error) => console.log(error));
        } else {
            setErrorMessage("Les mots de passe ne correspondent pas.");
        }
    };

    return (
        <React.Fragment>
            <h1>Créer un compte</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Entrez votre adresse e-mail"
                    value={email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="passwordConfirm"
                    placeholder="Confirmez votre mot de passe"
                    value={passwordConfirm}
                    onChange={handleChange}
                    required
                />
                <button>Sign up</button>
                {errorMessage !== "" && (
                    <p className="error-msg">{errorMessage}</p>
                )}
            </form>
            <Link to="/login">Déjà un compte ? S'identifier</Link>
        </React.Fragment>
    );
};

export default SignUp;
