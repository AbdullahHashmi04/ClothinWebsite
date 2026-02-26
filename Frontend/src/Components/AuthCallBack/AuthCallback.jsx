// src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleGoogleLogin = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token"); // if backend sends token in query
            if (!token) {
                return navigate("/login");
            }

            localStorage.setItem("token", token);

            navigate("/");
        };

        handleGoogleLogin();
    }, [navigate]);

    return <p>Logging you in...</p>;
};

export default AuthCallback;