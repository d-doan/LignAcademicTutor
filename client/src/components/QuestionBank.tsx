import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';

interface RouteParams {
    [key: string]: string | undefined;
}

const QuestionBank = () => {
    const navigate = useNavigate();

    const params = useParams<RouteParams>();
    const topic = params.topic ?? 'default';

    return (
        <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh">
        <Button variant="outlined" onClick={() => navigate('/')}>Back to Menu</Button>
        <h1>{topic.charAt(0).toUpperCase() + topic.slice(1)} Question Bank</h1>
        {/* Content based on the topic */}
        </Box>
    );
};

export default QuestionBank;