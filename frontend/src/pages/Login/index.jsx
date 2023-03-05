import React, { useState } from "react";
import { Link } from "react-router-dom";
import { fetchCredentials } from "../../utils/user";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isCredentialsMatch, setIsCredentialsMatch] = useState(true);

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
                console.log("========= response : =======", response);
                setIsCredentialsMatch(response.status === 401 ? false : true);
            })
            .catch((error) => console.log(error));
    };

    return (
        <React.Fragment>
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
            {!isCredentialsMatch && (
                <p className="credentials-error">
                    La paire email / mot de passe est incorrecte.
                </p>
            )}
            <Link to="/signup">Créer un compte</Link>
        </React.Fragment>
    );
};

export default Login;
