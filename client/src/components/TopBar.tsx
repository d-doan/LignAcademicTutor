import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onLogin: () => void; // Assuming you have a login function to call
}

const TopBar: React.FC<TopBarProps> = ({ onLogin }) => {
    const navigate = useNavigate();

    return (
        <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Placeholder div to center the title while having buttons on the side */}
            <div style={{ width: 48 }}></div>
            <Typography margin="20px" variant="h4" component="h1" sx={{ flexGrow: 1, textAlign: 'center' }}>
            LIGN 167 AI Assisted Question Bank
            </Typography>
            <Button color="inherit" onClick={() => navigate('/login')}>Log In / Sign Up</Button>
        </Toolbar>
        </AppBar>
    );
};

export default TopBar;