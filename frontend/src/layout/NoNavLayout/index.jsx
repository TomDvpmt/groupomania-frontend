import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import PropTypes from "prop-types";

const NoNavLayout = ({ isLogged, page }) => {
    NoNavLayout.propTypes = {
        isLogged: PropTypes.bool,
        page: PropTypes.string,
    };
    return (
        <>
            <Header isLogged={isLogged} page={page} />
            <Outlet />
        </>
    );
};

export default NoNavLayout;
