import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

const NoNavLayout = () => {
    return (
        <>
            <Header hasToken={false} />
            <Outlet />
        </>
    );
};

export default NoNavLayout;
