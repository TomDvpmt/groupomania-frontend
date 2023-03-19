import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import PropTypes from "prop-types";

const NavLayout = ({ isLogged, page, loggedUserId }) => {
    NavLayout.propTypes = {
        isLogged: PropTypes.bool,
        page: PropTypes.string,
        loggedUserId: PropTypes.number,
    };

    return (
        <>
            <Header
                isLogged={isLogged}
                page={page}
                loggedUserId={loggedUserId}
            />
            <Outlet />
        </>
    );
};

export default NavLayout;
