import React, { useState, useEffect } from 'react';
import { Card, Button, Form, ListGroup, Badge, Alert, Spinner } from 'react-bootstrap';
import { attachmentService } from '../services/api';

const FileUpload = ({ ticketId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (ticketId) {
            fetchAttachments();
        }
    }, [ticketId]);

    const fetchAttachments = async () => {
        try {
            setLoading(true);
            const response = await attachmentService.getAttachmentsByTicket(ticketId);
            setAttachments(response.data);
        } catch (err) {
            console.error('Error fetching attachments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0]);
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }

        try {
            setUploading(true);
            setError(null);
            await attachmentService.uploadFile(ticketId, selectedFile);
            setSelectedFile(null);
            document.getElementById('fileInput').value = '';
            fetchAttachments();
        } catch (err) {
            setError(err.response?.data || 'Failed to upload file');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (id, fileName) => {
        try {
            const response = await attachmentService.downloadFile(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to download file');
            console.error('Download error:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this attachment?')) {
            try {
                await attachmentService.deleteAttachment(id);
                fetchAttachments();
            } catch (err) {
                alert('Failed to delete attachment');
                console.error('Delete error:', err);
            }
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <Card className="mt-3">
            <Card.Body>
                <Card.Title>Attachments</Card.Title>
                
                {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
                
                <Form.Group className="mb-3">
                    <Form.Control
                        id="fileInput"
                        type="file"
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                    <Form.Text className="text-muted">
                        Maximum file size: 10MB
                    </Form.Text>
                </Form.Group>

                <Button 
                    variant="primary" 
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="mb-3"
                >
                    {uploading ? 'Uploading...' : 'Upload File'}
                </Button>

                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" size="sm" />
                    </div>
                ) : attachments.length === 0 ? (
                    <Alert variant="info">No attachments yet</Alert>
                ) : (
                    <ListGroup>
                        {attachments.map((attachment) => (
                            <ListGroup.Item key={attachment.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{attachment.fileName}</strong>
                                    <br/>
                                    <small className="text-muted">
                                        {formatFileSize(attachment.fileSize)} • 
                                        {' '}{new Date(attachment.uploadedAt).toLocaleDateString()}
                                        {attachment.uploadedBy && ` • ${attachment.uploadedBy.fullName || attachment.uploadedBy.username}`}
                                    </small>
                                </div>
                                <div>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={() => handleDownload(attachment.id, attachment.fileName)}
                                    >
                                        Download
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDelete(attachment.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Card.Body>
        </Card>
    );
};

export default FileUpload;