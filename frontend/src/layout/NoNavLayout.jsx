import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const NoNavLayout = () => {
    return (
        <>
            <Header nav={false} />
            <Outlet />
        </>
    );
};

export default NoNavLayout;
