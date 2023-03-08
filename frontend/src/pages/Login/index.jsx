import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCredentials } from "../../utils/user";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        }
        if (e.target.name === "password") {
            setPassword(e.target.value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const loginData = {
            email: email,
            password: password,
        };

        fetchCredentials("login", loginData)
            .then((response) => {
                if (response.status !== 200) {
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
    };

    return (
        <React.Fragment>
            <h1>Connexion</h1>
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
                <button>Login</button>
            </form>
            {errorMessage !== "" && (
                <p className="credentials-error">{errorMessage}</p>
            )}
            <Link to="/signup">Créer un compte</Link>
        </React.Fragment>
    );
};

export default Login;
