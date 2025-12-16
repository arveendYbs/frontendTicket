import React, { useEffect, useState } from 'react';
import { Alert, Card, Container, Button } from 'react-bootstrap';
import { authService } from '../services/api';

const AuthDebug = () => {
    const [debugInfo, setDebugInfo] = useState({
        tokenExists: false,
        tokenValue: '',
        userExists: false,
        userData: null,
        isAuthenticated: false
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        setDebugInfo({
            tokenExists: !!token,
            tokenValue: token ? `${token.substring(0, 50)}...` : 'No token',
            userExists: !!user,
            userData: user,
            isAuthenticated: authService.isAuthenticated()
        });
    };

    const clearAuth = () => {
        localStorage.clear();
        checkAuth();
        alert('Auth data cleared! Refresh page to login again.');
    };

    const testToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found!');
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/api/tickets', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            alert(`Response Status: ${response.status}\n${response.status === 200 ? 'Token is VALID ✅' : 'Token is INVALID ❌'}`);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>
                    <h4>Authentication Debug Info</h4>
                </Card.Header>
                <Card.Body>
                    <Alert variant={debugInfo.isAuthenticated ? 'success' : 'danger'}>
                        <strong>Authentication Status:</strong> {debugInfo.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
                    </Alert>

                    <h5>Token Status:</h5>
                    <pre className="bg-light p-3">
                        Token Exists: {debugInfo.tokenExists ? '✅ Yes' : '❌ No'}{'\n'}
                        Token Value: {debugInfo.tokenValue}
                    </pre>

                    <h5>User Data:</h5>
                    <pre className="bg-light p-3">
                        User Exists: {debugInfo.userExists ? '✅ Yes' : '❌ No'}{'\n'}
                        {debugInfo.userData && JSON.stringify(debugInfo.userData, null, 2)}
                    </pre>

                    <h5>localStorage Contents:</h5>
                    <pre className="bg-light p-3">
                        {Object.keys(localStorage).map(key => 
                            `${key}: ${localStorage.getItem(key)?.substring(0, 100)}...\n`
                        )}
                    </pre>

                    <div className="mt-3">
                        <Button variant="primary" onClick={checkAuth} className="me-2">
                            Refresh Debug Info
                        </Button>
                        <Button variant="warning" onClick={testToken} className="me-2">
                            Test Token
                        </Button>
                        <Button variant="danger" onClick={clearAuth}>
                            Clear Auth Data
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AuthDebug;