import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { userService, authService } from '../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers();
            setUsers(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id) => {
        if (window.confirm('Are you sure you want to deactivate this user?')) {
            try {
                await userService.deactivateUser(id);
                fetchUsers();
            } catch (err) {
                alert('Failed to deactivate user');
            }
        }
    };

    const handleActivate = async (id) => {
        try {
            await userService.activateUser(id);
            fetchUsers();
        } catch (err) {
            alert('Failed to activate user');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await userService.deleteUser(id);
                fetchUsers();
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

    const getRoleBadges = (roles) => {
        if (!roles || roles.length === 0) return <Badge bg="secondary">No Roles</Badge>;
        
        const roleColors = {
            'ROLE_ADMIN': 'danger',
            'ROLE_MANAGER': 'warning',
            'ROLE_AGENT': 'info',
            'ROLE_EMPLOYEE': 'secondary'
        };
        
        return roles.map((role, index) => (
            <Badge 
                key={index} 
                bg={roleColors[role] || 'secondary'} 
                className="me-1"
            >
                {role.replace('ROLE_', '')}
            </Badge>
        ));
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-3">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>User Management</h2>
                <Button variant="outline-primary" onClick={fetchUsers}>
                    Refresh
                </Button>
            </div>

            {users.length === 0 ? (
                <Alert variant="info">No users found</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Full Name</th>
                            <th>Roles</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.fullName || '-'}</td>
                                <td>{getRoleBadges(user.roles)}</td>
                                <td>
                                    {user.active ? 
                                        <Badge bg="success">Active</Badge> : 
                                        <Badge bg="secondary">Inactive</Badge>
                                    }
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    {user.active ? (
                                        <Button 
                                            variant="outline-warning" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => handleDeactivate(user.id)}
                                            disabled={user.id === currentUser?.id}
                                        >
                                            Deactivate
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="outline-success" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => handleActivate(user.id)}
                                        >
                                            Activate
                                        </Button>
                                    )}
                                    {currentUser?.roles?.includes('ROLE_ADMIN') && (
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleDelete(user.id)}
                                            disabled={user.id === currentUser?.id}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default UserManagement;