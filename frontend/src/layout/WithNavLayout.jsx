import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const WithNavLayout = () => {
    return (
        <>
            <Header nav={true} />
            <Outlet />
        </>
    );
};

export default WithNavLayout;
