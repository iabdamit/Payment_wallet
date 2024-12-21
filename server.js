const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: (value) => /^[1-9]\d{9}$/.test(value.toString()),
            message: (props) => `${props.value} is not a valid mobile number!`
        }
    },
    password: { type: String, required: true },
    upi_id: { type: String, required: true },
    balance: { type: Number, default: 1000 }
});

// User Model
const User = mongoose.model("User", userSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    sender_upi_id: { type: String, required: true },
    receiver_upi_id: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    timestamp: { type: Date, default: Date.now }
});

// Transaction Model
const Transaction = mongoose.model("Transaction", transactionSchema);

// Function to generate UPI ID
const generateUPI = async () => {
    let unique = false;
    let upi_id;
    while (!unique) {
        const randomId = crypto.randomBytes(4).toString("hex");
        upi_id = `${randomId}@fastpay`;
        const existing = await User.findOne({ upi_id });
        if (!existing) unique = true;
    }
    return upi_id;
};

// SignUp Route
app.post("/api/signup", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user already exists
        let user = await User.findOne({ phone });
        if (user) {
            return res.status(400).send({ message: "User already exists" });
        }

        let existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).send({ message: "Email already in use" });
        }

        // Generate UPI ID and create user
        const upi_id = await generateUPI();
        user = new User({ name, email, phone, password: hashedPassword, upi_id, balance: 1000 });
        await user.save();

        res.status(201).send({ message: "User registered successfully!", upi_id });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
});

// Fetch User Details Route
app.get("/api/user/:upi_id", async (req, res) => {
    try {
        const { upi_id } = req.params;
        const user = await User.findOne({ upi_id }).select("-password");
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send({ message: "Server Error", error: error.message });
    }
});

// Create Transaction Route
app.post('/api/transaction', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { sender_upi_id, receiver_upi_id, amount } = req.body;

        const sender = await User.findOne({ upi_id: sender_upi_id }).session(session);
        const receiver = await User.findOne({ upi_id: receiver_upi_id }).session(session);

        if (!sender || !receiver) {
            return res.status(404).send({ message: "Sender or receiver not found" });
        }

        if (sender.balance < amount) {
            return res.status(400).send({ message: "Insufficient balance" });
        }

        // Update balances
        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save({ session });
        await receiver.save({ session });

        // Create transaction
        const transaction = new Transaction({ sender_upi_id, receiver_upi_id, amount });
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).send({ message: "Transaction successful", transaction });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction error:", error);
        res.status(500).send({ message: "Server error", error: error.message });
    }
});

// Get Transactions for a User
app.get('/api/transactions/:upi_id', async (req, res) => {
    try {
        const { upi_id } = req.params;
        const transactions = await Transaction.find({
            $or: [{ sender_upi_id: upi_id }, { receiver_upi_id: upi_id }]
        });
        res.status(200).send(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).send({ message: "Server error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
