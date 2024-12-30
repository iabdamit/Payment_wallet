import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await axios.post(
                "http://localhost:4003/api/signup",
                formData
            );
            setSuccessMessage(
                response.data?.message || "Signup successful! You can now log in."
            );
            setFormData({ name: "", email: "", phone: "", password: "" });
        } catch (error) {
            console.error(
                "Signup error:",
                error.response?.data?.message || error.message
            );
            setErrorMessage(
                error.response?.data?.message ||
                "Error signing up. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                className="d-flex justify-content-center align-items-center"
                style={{
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    padding: "20px",
                }}
            >
                <div
                    className="card shadow"
                    style={{
                        maxWidth: "400px",
                        width: "100%",
                        borderRadius: "15px",
                        padding: "20px",
                    }}
                >
                    <h1
                        className="mb-4 text-center"
                        style={{ fontWeight: "700", color: "#333" }}
                    >
                        Sign up to{" "}
                        <span style={{ color: "#2575fc" }}>Smart Wallet</span>
                    </h1>
                    <form onSubmit={handleSubmit}>
                        {["name", "email", "phone", "password"].map((field) => (
                            <div className="form-floating mb-3" key={field}>
                                <input
                                    type={
                                        field === "password"
                                            ? "password"
                                            : field === "email"
                                                ? "email"
                                                : "text"
                                    }
                                    name={field}
                                    id={field}
                                    className="form-control"
                                    placeholder=" "
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
                                    onBlur={(e) =>
                                        (e.target.style.borderColor = "#ddd")
                                    }
                                />
                                <label htmlFor={field}>
                                    {field.charAt(0).toUpperCase() +
                                        field.slice(1)}
                                </label>
                            </div>
                        ))}
                        {errorMessage && (
                            <p className="text-danger text-center">{errorMessage}</p>
                        )}
                        {successMessage && (
                            <p className="text-success text-center">{successMessage}</p>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
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
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>
                    <p className="mt-4 text-center">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            style={{
                                textDecoration: "none",
                                color: "#2575fc",
                            }}
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}