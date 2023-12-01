import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };
      
      const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = () => {
        // Implement your login logic here
        if (!username || !password) {
            alert('Please enter both email and password.');
            return;
        }

        // Send request to db to get login

        navigate('/'); // Route to menu
    };

    const handleCreateAccount = () => {
        navigate('/create-account'); // Replace with your actual sign-up route
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h5" component="h1" sx={{ textAlign: 'center' }}>
            Log In
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label="Username" type="text" required value={username} onChange={handleUsernameChange} />
            <TextField label="Password" type="password" required value={password} onChange={handlePasswordChange} />
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Log In
            </Button>
            <Button color="secondary" onClick={handleCreateAccount}>
                Create an Account
            </Button>
            </Box>
        </Paper>
        </Box>
    );
};

export default LoginPage;