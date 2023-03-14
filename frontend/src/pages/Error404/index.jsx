import { Link } from "react-router-dom";

const Error404 = () => {
    return (
        <>
            <h1>Page non trouvée.</h1>
            <p>La page que vous cherchez n'existe pas.</p>
            <Link to="/">Retour à l'accueil</Link>
        </>
    );
};

export default Error404;
