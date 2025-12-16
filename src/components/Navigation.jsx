import React from 'react';
import { Navbar, Container, Nav, Button, Badge } from 'react-bootstrap';
import { authService } from '../services/api';

const Navigation = ({ user, onLogout, onNavigate }) => {
    const handleLogout = () => {
        authService.logout();
        onLogout();
    };

    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const isManager = user?.roles?.includes('ROLE_MANAGER');

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand style={{ cursor: 'pointer' }} onClick={() => onNavigate('tickets')}>
                    <i className="bi bi-ticket-perforated me-2"></i>
                    Ticket Management System
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => onNavigate('tickets')}>Tickets</Nav.Link>
                        {(isAdmin || isManager) && (
                            <Nav.Link onClick={() => onNavigate('users')}>Users</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        <Navbar.Text className="me-3">
                            Welcome, <strong>{user?.fullName || user?.username}</strong>
                            {' '}
                            {user?.roles?.map((role, idx) => (
                                <Badge key={idx} bg="info" className="ms-1">
                                    {role.replace('ROLE_', '')}
                                </Badge>
                            ))}
                        </Navbar.Text>
                        <Button variant="outline-light" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;