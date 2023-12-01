import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateAccountPage: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };
    
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    }

    const handleCreateAccount = async () => {
        // Create account logic
        if (!username || !password || !code) {
            alert('Please email, password, and authentication code.');
            return;
        }

        // Send request to db to create login
        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, code }),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);  // Or handle user redirection, etc.
                navigate('/'); // Route to menu or login page
            } else {
                const errorData = await response.json();
                alert(errorData.error);  // Display error message from server
            }
        } catch (error) {
            console.error('Error creating account:', error);
            alert('Error creating account. Please try again.');
        }

        // Route to menu
        navigate('/');
    };

    const handleLogin = () => {
        navigate('/login'); // Replace with your actual sign-up route
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h5" component="h1" sx={{ textAlign: 'center' }}>
            Create Account
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label="Username" type="text" required value={username} onChange={handleUsernameChange} />
            <TextField label="Password" type="password" required value={password} onChange={handlePasswordChange} />
            <TextField label="Authentication Code" type="text" required value={code} onChange={handleCodeChange}/>
            <Button variant="contained" color="primary" onClick={handleCreateAccount}>
                Create Account
            </Button>
            <Button color="secondary" onClick={handleLogin}>
                Sign In
            </Button>
            </Box>
        </Paper>
        </Box>
    );
};

export default CreateAccountPage;