import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface User {
    username: string;
}

interface TopBarProps {
    user: User | null;  // User object or null if not logged in
}

const TopBar: React.FC<TopBarProps> = ({ user }) => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for session handling
            });
    
            if (response.ok) {
                // Update the global state/user context to reflect that the user is logged out
            } else {
                // Handle error
                const errorData = await response.json();
                console.error('Logout error:', errorData.error);
            }
        } catch (error) {
            console.error('Logout failed:', error);
            // Handle error
        }
        window.location.reload(); // refresh page
    }

    return (
        <AppBar position="static" color="default" elevation={0}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box display="flex" alignItems="center">
                    <div>
                        {user && (
                            <div>
                                <Button color="inherit" onClick={() => navigate('/logs')}>Instructor Logs</Button>
                                <Button color="inherit" onClick={() => navigate('/reports')}>Reported Questions</Button>
                            </div>
                        )}
                    </div>
                    <Typography variant="h4" component="h1" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        LIGN 101 AI Assisted Question Bank
                    </Typography>
                </Box>
                {user ? (
                    <div>
                        <Typography variant="subtitle1" component="span">
                            {user.username}
                        </Typography>
                        {user.username == 'admin' && ( // Check if the user is an admin
                            <Button color="inherit" onClick={() => navigate('/generate')}>Generate Codes</Button>
                        )}
                        <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" component="span" sx={{ marginLeft: '8px' }}>
                            Student
                        </Typography>
                        <Button color="inherit" onClick={() => navigate('/login')}>Sign In / Create Account</Button>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;