import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ticket API endpoints
export const ticketService = {
    // Get all tickets
    getAllTickets: () => api.get('/tickets'),
    
    // Get ticket by ID
    getTicketById: (id) => api.get(`/tickets/${id}`),
    
    // Create new ticket
    createTicket: (ticketData) => api.post('/tickets', ticketData),
    
    // Update ticket
    updateTicket: (id, ticketData) => api.put(`/tickets/${id}`, ticketData),
    
    // Delete ticket
    deleteTicket: (id) => api.delete(`/tickets/${id}`),
    
    // Get tickets by status
    getTicketsByStatus: (status) => api.get(`/tickets/status/${status}`),
    
    // Get tickets by priority
    getTicketsByPriority: (priority) => api.get(`/tickets/priority/${priority}`),
};

export default api;