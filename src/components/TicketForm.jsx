import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { ticketService } from '../services/api';

const TicketForm = ({ ticketToEdit, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'OPEN',
        priority: 'MEDIUM'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (ticketToEdit) {
            setFormData({
                title: ticketToEdit.title || '',
                description: ticketToEdit.description || '',
                status: ticketToEdit.status || 'OPEN',
                priority: ticketToEdit.priority || 'MEDIUM'
            });
        }
    }, [ticketToEdit]);

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
            if (ticketToEdit) {
                await ticketService.updateTicket(ticketToEdit.id, formData);
            } else {
                await ticketService.createTicket(formData);
            }
            
            setFormData({
                title: '',
                description: '',
                status: 'OPEN',
                priority: 'MEDIUM'
            });
            
            onSuccess();
        } catch (err) {
            setError('Failed to save ticket. Please try again.');
            console.error('Error saving ticket:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            title: '',
            description: '',
            status: 'OPEN',
            priority: 'MEDIUM'
        });
        if (onCancel) onCancel();
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>
                    {ticketToEdit ? 'Edit Ticket' : 'Create New Ticket'}
                </Card.Title>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter ticket title"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter ticket description"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </Form.Select>
                    </Form.Group>

                    <div className="d-flex gap-2">
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (ticketToEdit ? 'Update Ticket' : 'Create Ticket')}
                        </Button>
                        <Button 
                            variant="secondary" 
                            type="button" 
                            onClick={handleReset}
                            disabled={loading}
                        >
                            {ticketToEdit ? 'Cancel' : 'Reset'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default TicketForm;