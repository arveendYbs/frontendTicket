import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Alert, Spinner } from 'react-bootstrap';
import { ticketService } from '../services/api';

const TicketList = ({ onEdit, onRefresh, onViewDetails }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTickets();
    }, [onRefresh]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await ticketService.getAllTickets();
            setTickets(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch tickets. Make sure the backend is running and you are logged in.');
            console.error('Error fetching tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            try {
                await ticketService.deleteTicket(id);
                fetchTickets();
            } catch (err) {
                alert('Failed to delete ticket');
                console.error('Error deleting ticket:', err);
            }
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            OPEN: 'primary',
            IN_PROGRESS: 'warning',
            RESOLVED: 'success',
            CLOSED: 'secondary'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
    };

    const getPriorityBadge = (priority) => {
        const variants = {
            LOW: 'info',
            MEDIUM: 'primary',
            HIGH: 'warning',
            URGENT: 'danger'
        };
        return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>;
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
                <h2>All Tickets</h2>
                <Button variant="outline-primary" onClick={fetchTickets}>
                    Refresh
                </Button>
            </div>

            {tickets.length === 0 ? (
                <Alert variant="info">No tickets found. Create your first ticket!</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Created By</th>
                            <th>Assigned To</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>{ticket.id}</td>
                                <td>{ticket.title}</td>
                                <td>{ticket.description?.substring(0, 50)}{ticket.description?.length > 50 ? '...' : ''}</td>
                                <td>{getStatusBadge(ticket.status)}</td>
                                <td>{getPriorityBadge(ticket.priority)}</td>
                                <td>{ticket.createdBy?.fullName || ticket.createdBy?.username || '-'}</td>
                                <td>{ticket.assignedTo?.fullName || ticket.assignedTo?.username || 'Unassigned'}</td>
                                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <Button 
                                        variant="outline-info" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={() => onViewDetails(ticket)}
                                    >
                                        View
                                    </Button>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={() => onEdit(ticket)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDelete(ticket.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default TicketList;