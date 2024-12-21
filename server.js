const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/mydb")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

//!  User Schema
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
    balance: { type: Number }
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

//* Transaction Model
const Transaction = mongoose.model("Transaction", transactionSchema);

//* Function to generate UPI ID
const generateUPI = () => {
    const randomId = crypto.randomBytes(4).toString('hex'); //it generates a random 8-character ID
    return `${randomId}@fastpay`;
}

//! SignUp Route

app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        let user = await User.findOne({ phone });
        if (user) {
            return res.status(400).send({ message: 'User already exists' });
        }
        const upi_id = generateUPI();
        const balance = 1000;

        //create new user
        user = new user({ name, email, phone, password, upi_id, balance });
        await user.save();
        res.status(201).send({ message: 'User registered successfully!', upi_id });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
});

//!Fetch User Details Route
app.get('/api/user/:upi_id', async (req, res) => {
    try {
        const { upi_id } = req.params;
        const user = await User.findOne({ upi_id });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send({ message: 'Server Error', error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

