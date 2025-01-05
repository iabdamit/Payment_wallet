import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/home";
import "bootstrap/dist/css/bootstrap.min.css";
import Transaction from './pages/transaction';
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

function App() {
  const [user, setUser] = useState(null);

  // Check for user in localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");

    // Clear user state in React
    setUser(null);

    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div>
      <Router>
        <Navbar
          expand="md"
          sticky="top"
          style={{
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
            padding: "10px",
          }}
          variant="dark"
        >
          <Container>
            <Navbar.Brand as={Link} to="/" style={{ fontSize: "24px", fontWeight: "900", color: "white" }}>
              PayEase
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ml-auto">
                {!user && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/login"
                      style={{ color: "white", fontWeight: "bold", transition: "color 0.3s" }}
                      onMouseOver={(e) => (e.target.style.color = "#1a6acb")}
                      onMouseOut={(e) => (e.target.style.color = "white")}
                    >
                      Login
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/signup"
                      style={{ color: "white", fontWeight: "bold", transition: "color 0.3s" }}
                      onMouseOver={(e) => (e.target.style.color = "#1a6acb")}
                      onMouseOut={(e) => (e.target.style.color = "white")}
                    >
                      Signup
                    </Nav.Link>
                  </>
                )}
                {user && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/transaction"
                      style={{ color: "white", fontWeight: "bold", transition: "color 0.3s" }}
                      onMouseOver={(e) => (e.target.style.color = "#1a6acb")}
                      onMouseOut={(e) => (e.target.style.color = "white")}
                    >
                      Home
                    </Nav.Link>
                    <NavDropdown
                      title={
                        <>
                          <i className="bi bi-person-circle"></i> {user.email}
                        </>
                      }
                      id="nav-dropdown"
                    >
                      <NavDropdown.Item onClick={handleLogout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/transaction" element={<Transaction />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
