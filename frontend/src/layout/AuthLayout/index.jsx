import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

const AuthLayout = () => {
    return (
        <>
            <Header hasToken={true} />
            <Outlet />
        </>
    );
};

export default AuthLayout;
