import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
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
            {/* Placeholder div to center the title while having buttons on the side */}
            <div style={{ width: 48 }}></div>
            <Typography margin="20px" variant="h4" component="h1" sx={{ flexGrow: 1, textAlign: 'center' }}>
            LIGN 101 AI Assisted Question Bank
            </Typography>
            {/* <Button color="inherit" onClick={() => navigate('/login')}>Log In / Sign Up</Button> */}
            {user ? (
                <div>
                    <Typography variant="subtitle1" component="span">
                        {user.username}
                    </Typography>
                    <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
                </div>
            ) : (
                <>
                    <Button color="inherit" onClick={() => navigate('/login')}>Sign In / Create Account</Button>
                    {/* Logout for debugging */}
                    {/* <Button color="inherit" onClick={handleSignOut}>Sign Out</Button> */}
                </>
            )}
        </Toolbar>
        </AppBar>
    );
};

export default TopBar;