import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-light text-center py-5">
            <Container>
                <Row className="justify-content-center align-items-center">
                    <Col md={8}>
                        <h1 className="display-4 fw-bold text-primary">
                            Fast & Secure Online Payments
                        </h1>
                        <p className="lead text-muted mb-4">
                            Experience seamless transactions with <span className="fw-bold">PayEase</span>.
                            Whether you're a small business or an enterprise, our platform offers the tools you need to manage payments effortlessly.
                        </p>
                        <ul className="list-unstyled text-start mx-auto" style={{ maxWidth: '400px' }}>
                            <li className="mb-2">✔️ Easy integration with your website or app</li>
                            <li className="mb-2">✔️ Accept payments globally in multiple currencies</li>
                            <li>✔️ Real-time transaction monitoring and analytics</li>
                        </ul>
                        <div className="mt-4">
                            <Link to="Signup">
                                <Button variant="primary" size="lg" className="me-2">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Home;


