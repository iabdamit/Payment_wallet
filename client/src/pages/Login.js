import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

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
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 shadow-sm">
                <h2 className="card-title mb-4 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">E-Mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    <button type="submit" className="btn btn-primary w-100">Log In</button>
                </form>
                <p className="mt-3 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="link-primary">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
