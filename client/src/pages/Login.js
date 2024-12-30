import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.post("http://localhost:4003/api/login", formData);
            const { upi_id, message, balance } = response.data;

            localStorage.setItem("user", JSON.stringify({ email: formData.email, upi_id, balance }));
            alert(message);
            navigate("/transaction");
        } catch (error) {
            console.error("Login error:", error.response?.data?.message || error.message);
            setErrorMessage(error.response?.data?.message || "Error logging in. Please check your credentials.");
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                padding: "20px",
            }}
        >
            <style>
                {`
                input:-webkit-autofill {
                    background-color: white !important;
                    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
                    box-shadow: 0 0 0px 1000px white inset !important;
                    color: black !important;
                }
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus,
                input:-webkit-autofill:active {
                    background-color: white !important;
                    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
                    box-shadow: 0 0 0px 1000px white inset !important;
                    color: black !important;
                }
                `}
            </style>
            <div
                className="card shadow"
                style={{
                    maxWidth: "400px",
                    width: "100%",
                    borderRadius: "15px",
                    padding: "20px",
                }}
            >
                <h1 className="mb-4 text-center" style={{ fontWeight: "700", color: "#333" }}>
                    Log in to <span style={{ color: "#2575fc" }}>Smart Wallet</span>
                </h1>
                <form onSubmit={handleSubmit}>
                    {["email", "password"].map((field) => (
                        <div className="form-floating mb-3" key={field}>
                            <input
                                type={field === "password" ? "password" : "email"}
                                name={field}
                                id={field}
                                className="form-control"
                                placeholder=" " // Required for floating label
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                style={{
                                    backgroundColor: "white",
                                    borderColor: "#ddd",
                                    transition: "border-color 0.3s, box-shadow 0.3s",
                                }}
                                onFocus={(e) =>
                                    (e.target.style.borderColor = "#2575fc")
                                }
                                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                            />
                            <label htmlFor={field}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                        </div>
                    ))}
                    {errorMessage && (
                        <p className="text-danger text-center mb-3">
                            {errorMessage}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        style={{
                            fontWeight: "bold",
                            padding: "12px",
                            fontSize: "14px",
                            borderRadius: "10px",
                            transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#1a6acb")
                        }
                        onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "#2575fc")
                        }
                    >
                        Log In
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" style={{ textDecoration: "none", color: "#2575fc" }}>
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
