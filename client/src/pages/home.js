import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
    return (
        <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
            <h1 className="mb-4 text-center">Welcome to UPI Payment App</h1>
            <p className="text-center mb-4">
                Seamlessly manage your transactions, check your balance, and much more.
            </p>
            <div className="d-flex justify-content-center">
                <Link to="/login" className="btn btn-primary mx-2">
                    Login
                </Link>
                <Link to="/signup" className="btn btn-secondary mx-2">
                    Sign Up
                </Link>
                <Link to="/transaction" className="btn btn-success mx-2">
                    Transactions
                </Link>
            </div>
        </div>
    );
}
