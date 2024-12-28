import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Transaction from "./pages/transaction";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/transaction" element={<Transaction />} />
      </Routes>
    </Router>
  );
}

export default App;
