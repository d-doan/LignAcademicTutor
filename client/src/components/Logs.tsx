import { Box, Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {};

const Logs = (props: Props) => {
    const navigate = useNavigate();

    // get logs from database
    useEffect(() => {

    }, []);

    return (
        <div>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Button variant="outlined" sx={{ margin:"20px" }} onClick={() => { navigate('/') }}>Back to Menu</Button>
                <h1>Instructor Logs</h1>
            </Box>
            {/* render logs from database */}
        </div>
    );
};

export default Logs;