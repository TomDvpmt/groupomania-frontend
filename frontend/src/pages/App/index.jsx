import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../components/Header/index";
import Login from "../Login/index";
import SignUp from "../SignUp/index";
import Home from "../Home/index";
import UpdatePost from "../UpdatePost";

const App = () => {
    const [postId, setPostId] = useState(null);
    console.log(postId);

    return (
        <React.Fragment>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Home setPostId={setPostId} />} />
                <Route
                    path={`/update`}
                    element={<UpdatePost postId={postId} />}
                />
            </Routes>
        </React.Fragment>
    );
};

export default App;
