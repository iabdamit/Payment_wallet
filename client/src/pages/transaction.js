import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function Transaction() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [receiverUpi, setReceiverUpi] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUserAndTransactions = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if (storedUser) {
                    setUser(storedUser);
                    fetchTransactions(storedUser.upi_id);
                    fetchBalance(storedUser.upi_id);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserAndTransactions();
    }, []);

    const fetchTransactions = async (upi_id) => {
        try {
            const response = await axios.get(
                `http://localhost:4003/api/transactions/${upi_id}`
            );
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const fetchBalance = async (upi_id) => {
        try {
            const response = await axios.get(
                `http://localhost:4003/api/user/${upi_id}`
            );
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    const handleTransaction = async () => {
        if (!amount || !receiverUpi) {
            setMessage("Please provide amount and receiver UPI ID");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:4003/api/transaction",
                {
                    sender_upi_id: user.upi_id,
                    receiver_upi_id: receiverUpi,
                    amount: parseFloat(amount),
                }
            );
            setMessage(response.data.message);
            if (response.status === 201) {
                fetchTransactions(user.upi_id);
                fetchBalance(user.upi_id);
                setAmount("");
                setReceiverUpi("");
            }
        } catch (error) {
            console.error("Error making transaction:", error);
            setMessage(error.response?.data?.message || "Transaction failed.");
        }
    };

    const chartData = transactions
        .map((tx) => ({
            timestamp: new Date(tx.timestamp).toLocaleDateString(),
            amount: tx.amount,
        }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4" style={{ color: "#2575fc" }}>
                Smart Wallet Dashboard
            </h1>

            {user && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5 className="card-title text-primary">User Information</h5>
                        <p className="card-text">
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p className="card-text">
                            <strong>UPI ID:</strong> {user.upi_id}
                        </p>
                        <p className="card-text">
                            <strong>Balance:</strong> ₹{user.balance}
                        </p>
                    </div>
                </div>
            )}

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title text-primary">Initiate Transaction</h5>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Receiver UPI ID"
                            value={receiverUpi}
                            onChange={(e) => setReceiverUpi(e.target.value)}
                        />
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleTransaction}
                        >
                            Send Money
                        </button>
                    </div>
                    {message && <p className="text-danger mt-2">{message}</p>}
                </div>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title text-primary">Transaction History</h5>
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Sender</th>
                                <th>Receiver</th>
                                <th>Amount</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <tr key={transaction._id}>
                                        <td>{transaction.sender_upi_id}</td>
                                        <td>{transaction.receiver_upi_id}</td>
                                        <td>₹{transaction.amount}</td>
                                        <td>
                                            {new Date(
                                                transaction.timestamp
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <h5 className="card-title text-primary">Transaction Graph</h5>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timestamp" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#2575fc"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
