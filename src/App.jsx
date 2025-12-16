import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import Login from './components/Login';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import UserManagement from './components/UserManagement';
import { authService } from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [ticketToEdit, setTicketToEdit] = useState(null);
    const [ticketToView, setTicketToView] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentView, setCurrentView] = useState('tickets');

    useEffect(() => {
        const savedUser = authService.getCurrentUser();
        if (savedUser && authService.isAuthenticated()) {
            setUser(savedUser);
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentView('tickets');
    };

    const handleEditTicket = (ticket) => {
        setTicketToEdit(ticket);
        setCurrentView('tickets');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewDetails = (ticket) => {
        setTicketToView(ticket);
    };

    const handleFormSuccess = () => {
        setTicketToEdit(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleCancelEdit = () => {
        setTicketToEdit(null);
    };

    const handleNavigate = (view) => {
        setCurrentView(view);
        setTicketToEdit(null);
    };

    if (!user) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="App">
            <Navigation 
                user={user} 
                onLogout={handleLogout}
                onNavigate={handleNavigate}
            />
            
            {currentView === 'tickets' && (
                <Container className="mt-4">
                    <TicketForm 
                        ticketToEdit={ticketToEdit}
                        onSuccess={handleFormSuccess}
                        onCancel={handleCancelEdit}
                    />
                    
                    <TicketList 
                        onEdit={handleEditTicket}
                        onViewDetails={handleViewDetails}
                        onRefresh={refreshTrigger}
                    />
                </Container>
            )}

            {currentView === 'users' && (
                <UserManagement />
            )}

            <TicketDetail 
                ticket={ticketToView}
                show={!!ticketToView}
                onHide={() => setTicketToView(null)}
            />

            <footer className="text-center mt-5 mb-3 text-muted">
                <p>&copy; 2024 Ticket Management System</p>
            </footer>
        </div>
    );
}

export default App;