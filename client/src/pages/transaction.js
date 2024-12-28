import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function Transaction() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [receiverUpi, setReceiverUpi] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {

    })
}