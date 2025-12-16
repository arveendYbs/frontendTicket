import React from 'react';
import { Modal, Badge, Button } from 'react-bootstrap';
import FileUpload from './FileUpload';

const TicketDetail = ({ ticket, show, onHide }) => {
    if (!ticket) return null;

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

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Ticket Details #{ticket.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <h5>{ticket.title}</h5>
                    <div className="mb-2">
                        {getStatusBadge(ticket.status)} {getPriorityBadge(ticket.priority)}
                    </div>
                </div>

                <div className="mb-3">
                    <strong>Description:</strong>
                    <p className="mt-2">{ticket.description || 'No description provided'}</p>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <strong>Created By:</strong>
                        <p>{ticket.createdBy?.fullName || ticket.createdBy?.username || 'Unknown'}</p>
                    </div>
                    <div className="col-md-6">
                        <strong>Assigned To:</strong>
                        <p>{ticket.assignedTo?.fullName || ticket.assignedTo?.username || 'Unassigned'}</p>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <strong>Created:</strong>
                        <p>{new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="col-md-6">
                        <strong>Last Updated:</strong>
                        <p>{new Date(ticket.updatedAt).toLocaleString()}</p>
                    </div>
                </div>

                <FileUpload ticketId={ticket.id} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TicketDetail;