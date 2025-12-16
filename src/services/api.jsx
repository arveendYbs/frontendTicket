import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Authentication API
export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

// Ticket API endpoints
export const ticketService = {
    getAllTickets: () => api.get('/tickets'),
    getTicketById: (id) => api.get(`/tickets/${id}`),
    createTicket: (ticketData) => api.post('/tickets', ticketData),
    updateTicket: (id, ticketData) => api.put(`/tickets/${id}`, ticketData),
    deleteTicket: (id) => api.delete(`/tickets/${id}`),
    getTicketsByStatus: (status) => api.get(`/tickets/status/${status}`),
    getTicketsByPriority: (priority) => api.get(`/tickets/priority/${priority}`),
};

// User API endpoints
export const userService = {
    getAllUsers: () => api.get('/users'),
    getUserById: (id) => api.get(`/users/${id}`),
    getActiveUsers: () => api.get('/users/active'),
    getUsersByRole: (role) => api.get(`/users/role/${role}`),
    updateUser: (id, userData) => api.put(`/users/${id}`, userData),
    deleteUser: (id) => api.delete(`/users/${id}`),
    deactivateUser: (id) => api.put(`/users/${id}/deactivate`),
    activateUser: (id) => api.put(`/users/${id}/activate`),
};

// Attachment API endpoints
export const attachmentService = {
    uploadFile: (ticketId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/attachments/upload/${ticketId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    getAttachmentsByTicket: (ticketId) => api.get(`/attachments/ticket/${ticketId}`),
    getAttachment: (id) => api.get(`/attachments/${id}`),
    downloadFile: (id) => {
        return api.get(`/attachments/download/${id}`, {
            responseType: 'blob',
        });
    },
    deleteAttachment: (id) => api.delete(`/attachments/${id}`),
};

export default api;