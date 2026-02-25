import { useEffect, useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CartContext from "./Context/CartContext";
import { motion } from "framer-motion";

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setLoginStatus } = useContext(CartContext);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            // Store the JWT token
            localStorage.setItem("token", token);

            // Decode basic user info from the JWT payload (base64)
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                localStorage.setItem("user", JSON.stringify({
                    id: payload.id,
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                }));
            } catch (e) {
                console.error("Failed to decode token:", e);
            }

            // Update global login state
            setLoginStatus(true);

            // Redirect to homepage after a brief moment
            setTimeout(() => navigate("/"), 1500);
        } else {
            setError("Authentication failed. No token received.");
            setTimeout(() => navigate("/login"), 3000);
        }
    }, [searchParams, navigate, setLoginStatus]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20 text-center max-w-md w-full"
            >
                {error ? (
                    <>
                        <div className="text-5xl mb-4">❌</div>
                        <h2 className="text-xl font-bold text-red-600 mb-2">Authentication Failed</h2>
                        <p className="text-gray-500 text-sm">Redirecting to login...</p>
                    </>
                ) : (
                    <>
                        <div className="text-5xl mb-4">✅</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Login Successful!</h2>
                        <p className="text-gray-500 text-sm">Redirecting you to the store...</p>
                        <div className="mt-6 flex justify-center">
                            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
