import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { authService } from '../services/api';

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await authService.login(formData);
            const { token, ...userData } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            onLoginSuccess(userData);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">
                        <h2>Login</h2>
                    </Card.Title>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
                    
                    <div className="mt-3 text-center text-muted">
                        <small>
                            Demo Accounts:<br/>
                            Admin: admin / password123<br/>
                            Manager: manager / password123<br/>
                            Agent: agent / password123<br/>
                            Employee: employee / password123
                        </small>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;