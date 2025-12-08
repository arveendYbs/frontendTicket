import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [ticketToEdit, setTicketToEdit] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleEditTicket = (ticket) => {
        setTicketToEdit(ticket);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFormSuccess = () => {
        setTicketToEdit(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleCancelEdit = () => {
        setTicketToEdit(null);
    };

    return (
        <div className="App">
            <Navigation />
            
            <Container className="mt-4">
                <TicketForm 
                    ticketToEdit={ticketToEdit}
                    onSuccess={handleFormSuccess}
                    onCancel={handleCancelEdit}
                />
                
                <TicketList 
                    onEdit={handleEditTicket}
                    onRefresh={refreshTrigger}
                />
            </Container>

            <footer className="text-center mt-5 mb-3 text-muted">
                <p>&copy; 2024 Ticket Management System</p>
            </footer>
        </div>
    );
}

export default App;